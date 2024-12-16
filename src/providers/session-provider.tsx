'use client'

import { SessionProvider, SessionProviderProps } from 'next-auth/react'

export default function NextAuthProvider({ children }: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
}
