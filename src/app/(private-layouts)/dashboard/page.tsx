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
    <div className='container mx-auto py-8 max-w-lg px-4'>
      <div className='mb-4'>
        <p className='text-justify text-base'>
          <strong>Welcome</strong> to my Service{' '}
          <strong>Chatbot, Semantic Search, Machine Learning</strong>!
        </p>
      </div>
    </div>
  )
}
