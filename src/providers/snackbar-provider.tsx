'use client'

import { createContext, FC, useState, ReactNode, useContext } from 'react'

type SnackBarContextActions = {
  showSnackBar: (
    message: string,
    severity: 'info' | 'success' | 'warning' | 'error',
    timeout?: number,
  ) => void
}

const SnackBarContext = createContext<SnackBarContextActions>({} as SnackBarContextActions)

interface SnackBarContextProviderProps {
  children: ReactNode
}

const SnackBarProvider: FC<SnackBarContextProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [timeout, setSnackBarTimeout] = useState<number>(6000)
  const [alertColor, setAlertColor] = useState<'info' | 'success' | 'warning' | 'error'>('info')

  const showSnackBar = (
    text: string,
    color: 'info' | 'success' | 'warning' | 'error',
    timeout?: number,
  ) => {
    setMessage(text)
    setAlertColor(color)
    setOpen(true)
    if (timeout) {
      setSnackBarTimeout(timeout)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setMessage('')
  }

  const getColorClasses = () => {
    switch (alertColor) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-black'
      case 'info':
      default:
        return 'bg-blue-500 text-white'
    }
  }

  return (
    <SnackBarContext.Provider value={{ showSnackBar }}>
      {open && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg ${getColorClasses()} transition-opacity duration-300`}
          style={{ animation: `fadeout ${timeout}ms forwards` }}
          onAnimationEnd={handleClose}
        >
          <span className='flex items-center justify-between'>
            {message}
            <button className='ml-4 text-white' onClick={handleClose}>
              &times;
            </button>
          </span>
        </div>
      )}
      {children}
    </SnackBarContext.Provider>
  )
}

const useSnackBar = (): SnackBarContextActions => {
  const context = useContext(SnackBarContext)

  if (!context) {
    throw new Error('useSnackBar must be used within a SnackBarProvider')
  }

  return context
}

export { SnackBarProvider, useSnackBar }
