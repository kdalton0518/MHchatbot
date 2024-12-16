'use client'

import * as React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import DropdownMenu from '@/src/components/Base/DropdownMenu'
import { useRouter } from 'next/navigation'

export default function TopMenuBar() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogin = () => {
    router.push('/sign-in')
  }

  const handleRegister = () => {
    router.push('/sign-up')
  }

  const handleProfile = () => {
    router.push('/profile')
  }

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  const primaryList = session?.user
    ? [{ label: 'Profile', action: handleProfile }]
    : [
        { label: 'Login', action: handleLogin },
        { label: 'Register', action: handleRegister },
      ]

  const secondaryList = session?.user ? [{ label: 'Logout', action: handleLogout }] : []

  return (
    <nav className='bg-gray-700 text-white px-8 py-4 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/dashboard' className='text-xl font-bold'>
          MHChatbot
        </Link>

        <div className='hidden md:flex space-x-8'>
          <a href='/llm' className='hover:text-gray-300'>
            CHATBOT
          </a>
          <a href='/ss' className='hover:text-gray-300'>
            SEMANTIC SEARCH
          </a>
          <a href='/ml' className='hover:text-gray-300'>
            ML CLASSIFICATION
          </a>
        </div>

        <div className='flex justify-end'>
          <DropdownMenu primary={primaryList} secondary={secondaryList} />
        </div>
      </div>
    </nav>
  )
}
