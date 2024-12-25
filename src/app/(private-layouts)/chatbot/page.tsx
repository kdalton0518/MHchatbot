'use client'

import React, { useState, useRef, useEffect } from 'react'
import { chatService } from '@/src/services/chatService'
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
    <div className='h-[calc(100vh-65px)] bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-gray-800 py-8'>
      <div className='container max-w-6xl mx-auto px-6'>
        <h1 className='text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white'>
          Mental Health Counseling Chatbot
        </h1>
        <div className='h-[520px] overflow-y-auto p-6 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {message.role === 'assistant' && (
                <div className='w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mr-3'>
                  A
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-green-200 text-white dark:bg-green-600 dark:text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-300'
                } shadow-md max-w-[70%]`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className='flex mt-4'>
          <textarea
            className='flex-1 border border-gray-300 rounded-lg p-2 text-lg shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            placeholder='Type your message...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className='ml-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200 dark:bg-green-500 dark:hover:bg-green-600'
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default LLMchatbot
