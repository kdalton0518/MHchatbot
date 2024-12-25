'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { chatService } from '@/src/services/chatService'
import toast from 'react-hot-toast'

interface SearchResult {
  id: number
  context: string
  response: string
  similarity: number
}

export default function SemanticSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setLoading(true)
    try {
      const response = await chatService.semantic_search(searchQuery)
      setResults(response)
      if (response.length === 0) {
        toast.success('No results found')
      }
    } catch (error) {
      toast.error('Error performing semantic search')
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-[calc(100vh-65px)] bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-gray-800 py-8'>
      <div className='container max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>Semantic Search</h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Search through our knowledge base using natural language
          </p>
        </div>

        <div className='relative max-w-3xl mx-auto mb-12 border-none'>
          <div className='flex items-center bg-white border-none dark:bg-gray-800 rounded-xl shadow-lg'>
            <input
              type='text'
              className='w-full px-6 py-4 text-lg border-none rounded-l-xl focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white'
              placeholder='What would you like to search for?'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-8 py-4 border-none rounded-r-xl flex items-center gap-2 ${
                loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-500 transition-colors'
              } text-white`}
            >
              <Search className='h-5 w-5' />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b dark:border-gray-700'>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300'>
                      ID
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300'>
                      Context
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300'>
                      Response
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300'>
                      Similarity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr
                      key={row.id}
                      className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                    >
                      <td className='px-6 py-4 text-gray-800 dark:text-gray-200'>{row.id}</td>
                      <td className='px-6 py-4 text-gray-800 dark:text-gray-200'>{row.context}</td>
                      <td className='px-6 py-4 text-gray-800 dark:text-gray-200'>{row.response}</td>
                      <td className='px-6 py-4 text-gray-800 dark:text-gray-200'>
                        <span className='inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full'>
                          {(1 - row.similarity).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
