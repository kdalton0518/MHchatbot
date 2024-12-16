'use client'

import { useState } from 'react'
import { useSnackBar } from '@/src/providers/snackbar-provider'
import { chatService } from '@/src/utils'

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
  const { showSnackBar } = useSnackBar()

  const handlePredict = async () => {
    if (!patientDescription.trim()) {
      showSnackBar('Please enter a patient description', 'warning')
      return
    }

    setLoading(true)
    try {
      const response = await chatService.predict_response_type({
        description: patientDescription,
      })
      setPredictions(response.data)
      showSnackBar('Prediction completed successfully', 'success')
    } catch (error) {
      showSnackBar('Error performing prediction', 'error')
      console.error('Prediction error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-5xl mx-auto p-4'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Response Predictor Using Machine Learning Model
        </h1>
        <p className='text-gray-600 mb-6'>
          Enter a description of the patient&apos;s situation to predict the likely response type
          and recommended approach.
        </p>

        <textarea
          className='w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none'
          rows={4}
          value={patientDescription}
          onChange={(e) => setPatientDescription(e.target.value)}
          placeholder="Describe the patient's situation, symptoms, or concerns..."
        ></textarea>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        className={`px-6 py-2 text-white rounded-lg ${
          loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? (
          <div className='flex items-center'>
            <svg
              className='animate-spin h-5 w-5 mr-2 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z'></path>
            </svg>
            Analyzing...
          </div>
        ) : (
          'Predict Response'
        )}
      </button>

      {predictions && (
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Prediction Results</h2>

          <div className='mb-4'>
            <h3 className='text-lg font-medium text-blue-600'>Problem Type:</h3>
            <span className='mt-1 inline-block bg-blue-500 text-white px-3 py-1 rounded-lg'>
              {predictions.problem_type}
            </span>
          </div>

          <div className='mb-4'>
            <h3 className='text-lg font-medium text-blue-600'>Predicted Response Type:</h3>
            <span className='mt-1 inline-block bg-purple-500 text-white px-3 py-1 rounded-lg'>
              {predictions.response_type}
            </span>
            <p className='mt-2 text-gray-600'>
              Confidence: {(predictions.confidence * 100).toFixed(1)}%
            </p>
          </div>

          <div className='mb-4'>
            <h3 className='text-lg font-medium text-blue-600'>Likely Associated Issues:</h3>
            <div className='mt-2 flex flex-wrap gap-2'>
              {predictions.likely_issues.map((issue, index) => (
                <span
                  key={index}
                  className='inline-block border border-gray-300 px-3 py-1 rounded-lg text-sm'
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium text-blue-600'>Recommended Approach:</h3>
            <p className='mt-2 text-gray-600'>{predictions.recommended_approach}</p>
          </div>
        </div>
      )}
    </div>
  )
}
