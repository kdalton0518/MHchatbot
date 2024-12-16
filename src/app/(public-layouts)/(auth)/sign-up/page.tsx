'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react' // Import icons from Lucide React
import GoogleSignIn from '@/src/components/Account/GoogleSignIn'
import Image from 'next/image'
import Link from 'next/link'

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className='flex h-screen items-center justify-center bg-muted'>
      <div className='absolute top-4 left-4'>
        <Link
          href='/'
          className='inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-100 transition-colors'
        >
          ← Return Home
        </Link>
      </div>
      <div className='w-full max-w-md space-y-8 p-6 shadow-md rounded-md bg-background border border-border'>
        <div className='flex justify-center'>
          <Image src='/icons/logo-green.png' alt='Logo' width={48} height={48} priority />
        </div>
        <div className='flex flex-row justify-center items-center'>
          <h2 className='text-center text-2xl font-bold ml-3'>Create an account</h2>
        </div>

        {/* Input Field */}
        <div className='space-y-4'>
          <input
            type='email'
            placeholder='Email address'
            className='w-full px-4 py-2 bg-background border border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          />
          <input
            type='text'
            placeholder='Username'
            className='w-full px-4 py-2 bg-background border border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
          />
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              className='w-full px-4 py-2 bg-background border border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute inset-y-0 right-3 flex items-center text-gray-500'
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button className='w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600'>
            Sign Up
          </button>
        </div>

        {/* Sign Up Link */}
        <p className='text-center text-sm text-foreground'>
          Already have an account?{' '}
          <Link href='/sign-in' className='text-green-500 hover:underline'>
            Sign In
          </Link>
        </p>

        {/* OR Divider */}
        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-500'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-background px-2 text-gray-500'></span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className='space-y-3'>
          <GoogleSignIn />
        </div>
      </div>
    </div>
  )
}
