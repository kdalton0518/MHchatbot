'use client'

import { chatService } from '@/src/services/chatService'
import { Search } from 'lucide-react'
import { useState } from 'react'
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
    <div className='bg-gradient-to-br from-green-100 to-green-100 dark:from-gray-900 dark:to-gray-900 min-h-screen py-8 overflow-x-hidden'>
      <div className='container max-w-6xl mx-auto px-4'>
        <div className='overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md mb-20 pb-5'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-100 dark:bg-gray-700'>
                <th className='px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider rounded-tl-xl'>
                  ID
                </th>
                <th className='px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider'>
                  Context
                </th>
                <th className='px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider'>
                  Response
                </th>
                <th className='px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider rounded-tr-xl'>
                  Similarity
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {results.length > 0 ? (
                results.map((row) => (
                  <tr
                    key={row.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
                  >
                    <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium'>
                      #{row.id}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-300'>
                      {row.context}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-300'>
                      {row.response}
                    </td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
                        {(1 - row.similarity).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'
                  >
                    <div className='flex flex-col items-center space-y-2'>
                      <span className='text-lg font-medium'>No results found</span>
                      <span className='text-sm'>Try adjusting your search query</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-br from-green-100 to-green-100 dark:from-gray-900 dark:to-gray-900'>
          <div className='container max-w-6xl mx-auto'>
            <div className='flex items-center bg-white border-none dark:bg-gray-800 rounded-xl'>
              <input
                type='text'
                className='w-full px-6 py-4 text-md border-none rounded-l-xl shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none'
                placeholder='What would you like to search for?'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`px-8 py-4 border-none rounded-r-xl flex items-center gap-2 shadow-lg ${
                  loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-500 transition-colors'
                } text-white`}
              >
                <Search className='h-5 w-5' />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          <div className='text-center mt-1'>
            <span className='text-xs text-gray-500 dark:text-gray-400 text-center'>
              Search can make mistakes. Check important info.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
