'use client'

import React, { useState, useRef, useEffect } from 'react'
import { chatService } from '@/src/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const LLMchatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await chatService.get_chat_history()
        const formattedHistory: Message[] = []

        history.forEach((conversation: any) => {
          formattedHistory.push({
            role: 'user',
            content: conversation['user_message'],
          })
          formattedHistory.push({
            role: 'assistant',
            content: conversation['llm_message'],
          })
        })

        setMessages(formattedHistory)
        scrollToBottom()
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }

    loadChatHistory()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const assistantMessage = await fetchAssistantResponse(input)
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }])
      scrollToBottom()
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Unable to fetch response.' },
      ])
    }
  }

  const fetchAssistantResponse = async (user_message: string) => {
    const response = await chatService.send_user_message(user_message)
    return response.response || "Sorry, I couldn't process your request."
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='container max-w-5xl mx-auto flex flex-col h-[86vh] pt-4 px-4'>
      <h1 className='text-2xl font-bold mb-4'>Mental Health Counseling Chatbot</h1>
      <div className='flex-1 overflow-y-auto p-4 bg-gray-50 rounded-md shadow-inner'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {message.role === 'assistant' && (
              <div className='w-8 h-8 bg-white-100 rounded-full flex items-center justify-center mr-2'>
                A
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-lg ${
                message.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className='flex mt-4'>
        <textarea
          className='flex-1 border border-gray-300 rounded-md p-2 resize-none'
          placeholder='Type your message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default LLMchatbot
