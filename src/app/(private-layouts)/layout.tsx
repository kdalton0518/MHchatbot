'user client'

import { getUser } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import TopMenuBar from '@/src/components/Sidebar/TopMenuBar'
import { PropsWithChildren } from 'react'

export default async function PrivateLayout({ children }: PropsWithChildren) {
  const session = await getUser()
  if (!session?.user) redirect('/sign-in')

  return (
    <>
      <TopMenuBar />
      {children}
    </>
  )
}
