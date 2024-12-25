'use client'

import { useState } from 'react'
import { useSnackBar } from '@/src/providers/snackbarProvider'
import { chatService } from '@/src/utils'

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
  const { showSnackBar } = useSnackBar()

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showSnackBar('Please enter a search query', 'warning')
      return
    }

    setLoading(true)
    try {
      const response = await chatService.semantic_search(searchQuery)
      setResults(response)
      if (response.length === 0) {
        showSnackBar('No results found', 'info')
      }
    } catch (error) {
      showSnackBar('Error performing semantic search', 'error')
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container max-w-5xl mx-auto p-4'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>Semantic Search</h1>
        <div className='flex gap-4'>
          <input
            type='text'
            className='flex-grow p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none'
            placeholder='Enter your search query...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg ${
              loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full table-auto border-collapse border border-gray-200'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 px-4 py-2 text-left'>ID</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Context</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Response</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Similarity</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.id} className='hover:bg-gray-50'>
                <td className='border border-gray-300 px-4 py-2'>{row.id}</td>
                <td className='border border-gray-300 px-4 py-2'>{row.context}</td>
                <td className='border border-gray-300 px-4 py-2'>{row.response}</td>
                <td className='border border-gray-300 px-4 py-2'>
                  {(1 - row.similarity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
