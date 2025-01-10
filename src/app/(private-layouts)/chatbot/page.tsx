'use client'

import { chatService } from '@/src/services/chatService'
import { useSession } from 'next-auth/react'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const LLMchatbot: React.FC = () => {
  const { data: session } = useSession()
  const userId = session?.user.id || ''
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await chatService.get_chat_history(userId)
        const formattedHistory: Message[] = []

        history.forEach((conversation: any) => {
          formattedHistory.push({
            role: 'user',
            content: conversation['user'],
          })
          formattedHistory.push({
            role: 'assistant',
            content: conversation['assistant'],
          })
        })

        setMessages(formattedHistory)
        scrollToBottom()
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }

    loadChatHistory()
  }, [userId])

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
    const response = await chatService.send_user_message(user_message, userId)
    return response.response || "Sorry, I couldn't process your request."
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-gray-900 dark:to-gray-900 min-h-screen py-8 overflow-x-hidden'>
      <div className='container max-w-6xl mx-auto mb-20 pb-10'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className='flex-shrink-0'>
                <img
                  src='/icons/bot1.jpg'
                  alt='AI Assistant'
                  className='w-10 h-10 rounded-full ring-2 ring-green-500 p-1 bg-gray-700'
                />
              </div>
            )}
            <div
              className={`mb-4 px-4 py-3 rounded-2xl max-w-[70%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-none dark:from-gray-700 dark:to-gray-800 dark:text-gray-200'
                  : 'bg-emerald-50 text-gray-900 rounded-tl-none dark:bg-gray-900 dark:text-gray-400'
              }`}
            >
              <ReactMarkdown className='prose prose-gray max-w-none leading-relaxed'>
                {message.content}
              </ReactMarkdown>
            </div>
            {message.role === 'user' && (
              <div className='flex-shrink-0'>
                <img
                  src={session?.user?.image || '/icons/user1.jpg'}
                  alt={session?.user?.name || 'User'}
                  className='w-10 h-10 rounded-full ring-2 ring-green-500 p-1 bg-gray-700'
                />
              </div>
            )}
          </div>
        ))}

        <div className='fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-gray-900 dark:to-gray-900'>
          <div className='container max-w-6xl mx-auto'>
            <div className='relative'>
              <input
                type='text'
                className='w-full px-6 py-4 text-md border-none rounded-xl shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none'
                placeholder='Type your message...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className='absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-500 focus:ring-2 focus:ring-green-500 transition-all dark:bg-gray-700 dark:hover:bg-gray-600 duration-100'
                onClick={handleSend}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 10l7-7 7 7m-7-7v18'
                  />
                </svg>
              </button>
            </div>
            <div className='text-center mt-1'>
              <span className='text-xs text-gray-500 dark:text-gray-400 text-center'>
                MHChatbot can make mistakes. Check important info.
              </span>
            </div>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default LLMchatbot
