'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/apis',
      })

      if (result?.error) {
        setError('Invalid credentials')
        toast.error('Invalid credentials')
      } else if (result) {
        router.push('/apis')
        toast.success('Welcome!')
      }
    } catch (err) {
      setError('Authentication failed')
      toast.error('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4'>
      <Link
        href='/'
        className='absolute top-8 left-8 inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 group'
      >
        <ArrowLeft
          size={20}
          className='mr-2 group-hover:-translate-x-1 transition-transform duration-200 text-green-600 dark:text-gray-300'
        />
        <span className='font-medium text-gray-700 dark:text-gray-300'>Return Home</span>
      </Link>

      <div className='w-full max-w-md'>
        <form
          onSubmit={handleSubmit}
          className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200 dark:border-gray-700'
        >
          <div className='flex flex-col items-center space-y-1'>
            <Image
              src='/icons/logo-green.png'
              alt='Logo'
              width={48}
              height={48}
              priority
              className='animate-bounce mt-4'
            />
            <h2 className='text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 bg-clip-text text-transparent'>
              Welcome Back
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>Sign in to continue</p>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Email address
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-transparent transition-all duration-200'
                required
              />
            </div>

            <div className='space-y-2 pb-4'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-transparent transition-all duration-200'
                  required
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-500 dark:to-green-600 text-white text-sm rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg'
            >
              {isLoading ? (
                <span className='flex items-center justify-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5'
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
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className='pt-4'>
              <button
                type='button'
                onClick={handleGoogleSignIn}
                className='w-full py-2 text-sm border rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-md dark:hover:bg-gray-600'
              >
                <Image
                  src='/icons/google.png'
                  alt='Google Logo'
                  width={20}
                  height={20}
                  className='inline'
                />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>

          <p
            className={`text-center text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Don&apos;t have an account?{' '}
            <Link
              href='/sign-up'
              className='text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 font-medium hover:underline'
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
