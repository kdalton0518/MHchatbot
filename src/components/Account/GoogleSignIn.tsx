'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function GoogleSignIn() {
  return (
    <button
      onClick={() => signIn('google')}
      className='w-full flex items-center justify-center px-4 py-2 border border-2 border-gray-300 rounded-md text-foreground bg-background hover:bg-secondary'
    >
      <Image
        src='/icons/google.png' // Replace with your Google icon
        alt='Google'
        width={20}
        height={20}
      />
      <span className='ml-2'>Continue with Google</span>
    </button>
  )
}
