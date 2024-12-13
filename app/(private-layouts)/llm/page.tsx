"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { moduleService } from "@/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MessageBubble = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  maxWidth: "100%",
  marginBottom: theme.spacing(1),
  wordWrap: "break-word",
  "& ul, & ol": {
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  "& p": {
    margin: theme.spacing(0.5, 0),
  },
  "& strong": {
    fontWeight: 600,
  },
}));

const LLMchatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await moduleService.get_chat_history();
        const formattedHistory: Message[] = [];

        history.forEach((conversation: any) => {
          formattedHistory.push({
            role: "user",
            content: conversation["user_message"],
          });
          formattedHistory.push({
            role: "assistant",
            content: conversation["llm_message"],
          });
        });

        setMessages(formattedHistory);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    loadChatHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const assistantMessage = await fetchAssistantResponse(input);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
      scrollToBottom();
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Unable to fetch response." },
      ]);
    }
  };

  const fetchAssistantResponse = async (user_message: string) => {
    // Replace with your backend API call for the LLM bot response
    const response = await moduleService.send_user_message(user_message);

    return response.response || "Sorry, I couldn't process your request.";
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Container
      maxWidth="lg"
      style={{ height: "86vh", display: "flex", flexDirection: "column" }}
      sx={{
        pt: 2,
        pb: 0,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Mental Health Counseling Chatbot
      </Typography>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={message.role === "user" ? "flex-end" : "flex-start"}
            alignItems="flex-end"
            mb={2}
          >
            {message.role === "assistant" && (
              <Avatar alt="Assistant" style={{ marginRight: "8px" }}>
                A
              </Avatar>
            )}
            <MessageBubble
              elevation={1}
              style={{
                backgroundColor:
                  message.role === "user" ? "#d1e7ff" : "#e9ecef",
              }}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </MessageBubble>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box display="flex" mt={2}>
        <TextField
          fullWidth
          multiline
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "8px" }}
          onClick={handleSend}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default LLMchatbot;
