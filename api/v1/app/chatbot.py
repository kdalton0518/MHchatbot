# Solution 3 - Chatbot using LLM
import datetime
import functools
import json
import operator
import sys
from typing import Annotated, Literal, Sequence, TypedDict

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.errors import GraphRecursionError
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import InjectedState, ToolNode
from pydantic import BaseModel, Field
from sqlalchemy import text

from .utils import async_session, openai_embedding_one, sync_session

sys.stdout.reconfigure(encoding='utf-8')


class MedicAgentState(TypedDict):
    sender: str
    messages: Annotated[Sequence[BaseMessage], operator.add]


class ContextResponse(TypedDict):
    context: str = Field(description="Sample question")
    response: str = Field(description="Sample response")


@tool("semantically_similar_question_answer_fetch")
def semantically_similar_question_answer_fetch(
    state: Annotated[dict, InjectedState]) -> Annotated[list[ContextResponse], "List of sample (question, response) pairs"]:
    """This tool takes the human input and fetch the most relevant (question, answer) pair"""
    for x in reversed(state['messages']):
        if isinstance(x, HumanMessage):
            query_vector = openai_embedding_one(x.content)
            break
    k_similar_vector = get_top_k_vectors(query_vector)
    cotextResponses = [ContextResponse(
        context=vector["context"], response=vector["response"]) for vector in k_similar_vector]
    return cotextResponses

def get_top_k_vectors(query_vector):
    
    query_vector_str = json.dumps(query_vector)
    
    with sync_session() as session:
        sql = text("""
        SELECT context, response, semantic_vector <=> cast(:query_vector as vector) as similarity
        FROM public."Embedding" 
        ORDER BY semantic_vector <=> cast(:query_vector as vector)
        LIMIT 5
        """)
        
        result = session.execute(
            sql,
            {"query_vector": query_vector_str}
        )
        rows = result.fetchall()
        
        return [
            {
                "context": row.context,
                "response": row.response
            }
            for row in rows
        ]


tools = [semantically_similar_question_answer_fetch]

class MedicAgent():
    def __init__(self):
        self.async_session  = async_session
        
        self.llm = ChatOpenAI(model="gpt-4o")
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
        
        self.medicAgent = self.medic_agent(llm=self.llm, tools=tools)
        self.medicNode = functools.partial(
            self.medic_agent_to_node,
            agent=self.medicAgent,
            name="Medic"
        )
        
        self.toolNode = ToolNode(tools)
        
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

    def medic_agent_to_node(self, state, agent, name):
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


class MHChatBot():
    def __init__(self):
        self.async_session = async_session
        self.megicAgent = MedicAgent()
        self.config = {"recursion_limit": 10, "configurable": {"thread_id": "MVP_TEST"}}
        
    async def get_chat_history(self, user_id: str):
        async with self.async_session() as session:
            # First verify the user exists
            user_check = text("SELECT id FROM public.\"User\" WHERE id = :user_id")
            user_result = await session.execute(user_check, {"user_id": user_id})
            if not user_result.first():
                return []
                
            sql = text("""
            SELECT "id", "user", "assistant", "user_id", "created_at" 
            FROM public."Conversations" 
            WHERE user_id = :user_id
            ORDER BY created_at ASC
            """)
            
            result = await session.execute(sql, {"user_id": user_id})
            rows = result.fetchall()
            
            return [{
                "user": row.user,
                "assistant": row.assistant
            } for row in rows]

    async def save_chat_history(self, user_id: str, user: str, assistant: str):
        async with self.async_session() as session:
            # First verify the user exists
            user_check = text("SELECT id FROM public.\"User\" WHERE id = :user_id")
            user_result = await session.execute(user_check, {"user_id": user_id})
            if not user_result.first():
                return False
                
            sql = text("""
            INSERT INTO public."Conversations" ("id", "user", "assistant", "user_id", "created_at")
            VALUES (gen_random_uuid(), :user, :assistant, :user_id, now())
            """)

            await session.execute(sql, {"user": user, "assistant": assistant, "user_id": user_id})
            await session.commit()
            return True
            
    async def send(self, user_message, user_id):
        starttime  = datetime.datetime.now()
        dbhistory = await self.get_chat_history(user_id)
        
        get_history_time = datetime.datetime.now()
        print("🚀 get_history_time: ", get_history_time - starttime)
        
        history = []
        if len(dbhistory) != 0:
            history = []
            for entry in dbhistory:
                history.append(HumanMessage(entry["user"]))
                history.append(AIMessage(entry['assistant']))
        
        history.append(HumanMessage(content=user_message))
        try:
            res = self.megicAgent.graph.invoke(
                {
                    "messages": history,
                    "sender": "user",
                },
                self.config,
            )
            last_message = res["messages"][-1].content
            if last_message.startswith("FINAL ANSWER"):
                last_message = last_message[13:]
            if last_message.endswith("FINAL ANSWER"):
                last_message = last_message[:-13]
        except GraphRecursionError:
            last_message = "Sorry, there was an error in this multi-agent system. Please try again."
        history.append(AIMessage(content=last_message))
        
        generate_message_time = datetime.datetime.now()
        print("🚀 generate_message_time: ", generate_message_time - get_history_time)
        
        save_result =await self.save_chat_history(user_id, user_message, last_message)
        if save_result == False:
            return "Sorry, there isn't a user with this id. Please try again."
        
        save_chat_history_time = datetime.datetime.now()
        print("🚀 save_chat_history_time: ", save_chat_history_time - generate_message_time)
        return last_message
