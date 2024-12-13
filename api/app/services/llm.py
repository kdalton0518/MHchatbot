# Solution 3 - Chatbot using LLM
import operator
import functools
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph, START
from langgraph.prebuilt import ToolNode, InjectedState
from langgraph.errors import GraphRecursionError
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage
from pydantic import BaseModel, Field
from typing import Annotated, Literal, Sequence, TypedDict

from ..utils import postgres_userpass_conn_sync, openai_embedding_one, supabase_urlkey_conn
from ..config import settings
from ..models import History


supabase_client = supabase_urlkey_conn()


class MedicAgentState(TypedDict):
    sender: str
    messages: Annotated[Sequence[BaseMessage], operator.add]


class ContextResponse(TypedDict):
    context: str = Field(description="Sample question")
    response: str = Field(description="Sample response")


@tool("semantically_similar_questions_answer_fetch")
def semantically_similar_question_answer_fetch(
    state: Annotated[dict, InjectedState]) -> Annotated[list[ContextResponse], "List of sample (question, response) pairs"]:
    """This tool takes the human input and fetch the most relevant (question, answer) pair"""
    for x in reversed(state['messages']):
        if isinstance(x, HumanMessage):
            query_vector = openai_embedding_one(x.content)
            break
    k_similar_vector = get_top_k_vectors(query_vector)
    cotextResponses = [ContextResponse(context=vector["context"], response=vector["response"]) for vector in k_similar_vector]
    return cotextResponses


class MedicAgent():
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o")
        self.tools = [semantically_similar_question_answer_fetch]
        self.workflow = StateGraph(MedicAgentState)

        self.gateAgent = self.gate_agent(llm=self.llm)
        self.gateNode = functools.partial(
            self.gate_agent_to_node,
            agent=self.gateAgent,
            name="Gate"
        )

        self.idleAgent = self.idle_agent(llm=self.llm)
        self.idleNode = functools.partial(
            self.idle_agent_to_node,
            agent=self.idleAgent,
            name="Idle"
        )

        self.medicAgent = self.medic_agent(llm=self.llm, tools=self.tools)
        self.medicNode = functools.partial(
            self.medic_agent_to_node,
            agent=self.medicAgent,
            name="Medic"
        )

        self.toolNode = ToolNode(self.tools)

        self.workflow.add_node("Gate", self.gateNode)
        self.workflow.add_node("Idle", self.idleNode)
        self.workflow.add_node("Medic", self.medicNode)
        self.workflow.add_node("call_tool", self.toolNode)

        self.workflow.add_edge(START, "Gate")
        self.workflow.add_conditional_edges(
            "Gate",
            self.router_gate_node,
            {
                "Medic": "Medic",
                "Idle": "Idle"
            }
        )
        self.workflow.add_conditional_edges(
            "Medic",
            self.router_medic_node,
            {
                "call_tool": "call_tool",
                "__end__": END
            }
        )
        self.workflow.add_conditional_edges(
            "call_tool",
            lambda state: state["sender"],
            {
                "Medic": "Medic"
            }
        )
        self.workflow.add_edge("Idle", END)

        self.graph = self.workflow.compile()


    def gate_agent(self, llm):
        """Create an agent for gate"""
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful assistant."
                    "User will ask questions."
                    "You have to determine whether the question is related to mental health problem or not."
                    "If it is not related to mental health problem, you simply respond with 'Not'."
                    "If it is related to mental health problem, you respond with 'Medication'."
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        return prompt | llm


    def gate_agent_to_node(self, state, agent, name):
        result = agent.invoke(state)
        result = AIMessage(**result.dict(exclude={"type", "name"}), name=name)
        return {
            "sender": name,
            "messages": [result]
        }


    def idle_agent(self, llm):
        """Create an agent for general questions"""
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful assistant."
                    "User will ask normal questions from user."
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        return prompt | llm


    def idle_agent_to_node(self, state, agent, name):
        result = agent.invoke(state)
        result = AIMessage(**result.dict(exclude={"type", "name"}), name=name)
        return {
            "sender": name,
            "messages": [result]
        }


    def medic_agent(self, llm, tools):
        """Create an agent for medical questions"""
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful assistant.\n"
                    "User will ask questions about mental health.\n"
                    "Use the provided tool to progress towards answering the question.\n"
                    "If you think you have the answer, prefix your response with FINAL ANSWER.\n"
                    "You have access to the following tools: {tool_names}.\n",
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )
        prompt = prompt.partial(tool_names=", ".join(
            [tool.name for tool in tools]))

        return prompt | llm.bind_tools(tools)


    def medic_agent_to_node(self,state, agent, name):
        result = agent.invoke(state)
        result = AIMessage(**result.dict(exclude={"type", "name"}), name=name)
        return {
            "sender": name,
            "messages": [result]
        }


    def router_gate_node(self, state) -> Literal["Medic", "Idle"]:
        messages = state["messages"]
        last_message = messages[-1]
        if last_message.content.startswith("Not"):
            return "Idle"
        else:
            return "Medic"


    def router_medic_node(self, state) -> Literal["call_tool", "continue", "__end__"]:
        messages = state["messages"]
        last_message = messages[-1]
        if last_message.tool_calls:
            return "call_tool"
        else: 
            return "__end__" 


def get_top_k_vectors(query_vector):
    query_vector = openai_embedding_one(query_vector)
    rows = supabase_client.rpc("get_top_matches", {"query_vector": query_vector}).execute()

    return rows.data


def fetch_all_history(user_uuid):
    response = supabase_client.table('history').select(
        'user_message', 'llm_message'
    ).eq('user_uuid', user_uuid).execute()

    history = response.data
    return history


def save_new_message(user_uuid, user_message : str, llm_message : str):
    try:
        supabase_client.table('history').insert({'user_uuid': user_uuid, 'user_message': user_message, 'llm_message': llm_message}).execute()
    except Exception as e:
        print(e)
    
def new_chat(message, current_user_uuid):
    medic_agent = MedicAgent()
    config = {"recursion_limit": 10, "configurable": {"thread_id": "MVP_TEST"}}

    dbhistory = fetch_all_history(current_user_uuid)

    history = []
    if len(dbhistory) != 0:
        history = []
        for entry in dbhistory:
            history.append(HumanMessage(entry["user_message"]))
            history.append(AIMessage(entry['llm_message']))

    history.append(HumanMessage(content=message))
    try:
        res = medic_agent.graph.invoke(
            {
                "messages": history,
                "sender": "user",
            },
            config,
        )
        last_message = res["messages"][-1].content
        if last_message.startswith("FINAL ANSWER"):
            last_message = last_message[13:]
        if last_message.endswith("FINAL ANSWER"):
            last_message = last_message[:-13]
    except GraphRecursionError:
        last_message = "Sorry, there was an error in this multi-agent system. Please try again."
    history.append(AIMessage(content=last_message))
    save_new_message(current_user_uuid, message, last_message)

    return last_message

