'use client'

import UserProfile from '@/src/components/Account/UserProfile'
import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session } = useSession()
  if (!session?.user) {
    return null
  }
  return (
    <UserProfile
      userProfile={{
        name: session.user.name ?? null,
        id: session.user.id,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        password: null,
        created_at: new Date(),
        updated_at: new Date(),
      }}
      allowDelete={true}
    />
  )
}
