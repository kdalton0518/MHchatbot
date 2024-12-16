'use client'

import UserProfile from '@/src/components/Account/UserProfile'
import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session } = useSession()
  if (!session?.user) {
    return null
  }
  return (
    <div className='container mx-auto mt-4 mb-4 px-4'>
      <div className='flex justify-center'>
        <div className='w-full max-w-lg'>
          <div className='p-4 bg-gray shadow rounded-md flex flex-col'>
            <UserProfile
              userProfile={{
                name: session.user.name ?? null,
                id: session.user.id,
                email: session.user.email ?? null,
                emailVerified: session.user.emailVerified ?? null,
                image: session.user.image ?? null,
                password: session.user.password ?? null,
                is_active: session.user.is_active ?? null,
              }}
              allowDelete={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
