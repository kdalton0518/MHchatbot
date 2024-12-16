'use client'

import { Button } from '@/src/components/Base/Button'
import { signOut } from 'next-auth/react'

export default function SignOut() {
  return (
    <Button
      className='w-24'
      onClick={() => {
        signOut()
      }}
    >
      Sign out
    </Button>
  )
}
