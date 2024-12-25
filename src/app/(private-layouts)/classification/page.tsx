'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { chatService } from '@/src/services/chatService'

interface PredictionResult {
  problem_type: string
  response_type: string
  confidence: number
  likely_issues: string[]
  recommended_approach: string
}

export default function MLclassification() {
  const [patientDescription, setPatientDescription] = useState('')
  const [predictions, setPredictions] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    if (!patientDescription.trim()) {
      toast.error('Please enter a patient description')
      return
    }

    setLoading(true)
    try {
      const response = await chatService.predict_response_type({
        description: patientDescription,
      })
      setPredictions(response.data)
      toast.success('Prediction completed successfully')
    } catch (error) {
      toast.error('Error performing prediction')
      console.error('Prediction error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-[calc(100vh-65px)] bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-gray-800 py-8'>
      <div className='container max-w-6xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center'>
          AI-Powered Response Predictor
        </h1>
        <p className='text-gray-600 dark:text-gray-300 text-center text-lg mb-8'>
          Let our advanced ML model analyze patient situations and provide intelligent
          recommendations
        </p>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6'>
          <textarea
            className='w-full p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl 
                     focus:ring-2 focus:ring-green-400 focus:border-transparent 
                     transition-all duration-200 text-gray-700 dark:text-gray-200 
                     bg-white dark:bg-gray-800 min-h-[150px]'
            value={patientDescription}
            onChange={(e) => setPatientDescription(e.target.value)}
            placeholder="Describe the patient's situation, symptoms, or concerns in detail..."
          ></textarea>
        </div>

        <div className='text-center'>
          <button
            onClick={handlePredict}
            disabled={loading}
            className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${
              loading
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg'
            }`}
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <svg className='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Analyzing...
              </div>
            ) : (
              'Generate Prediction'
            )}
          </button>
        </div>

        {predictions && (
          <div className='mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center'>
              Analysis Results
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-xl'>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                    Problem Classification
                  </h3>
                  <span className='inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-medium'>
                    {predictions.problem_type}
                  </span>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-xl'>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                    Response Type
                  </h3>
                  <span className='inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-medium'>
                    {predictions.response_type}
                  </span>
                  <div className='mt-3 text-gray-700 dark:text-gray-300'>
                    Confidence: {(predictions.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-xl'>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                    Associated Issues
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {predictions.likely_issues.map((issue, index) => (
                      <span
                        key={index}
                        className='inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-lg text-sm font-medium'
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-xl'>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
                    Recommended Approach
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    {predictions.recommended_approach}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
