'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Icons } from '@/src/components/Base/Icons'
import { MainNav } from '@/src/components/Sidebar/MainNav'
import { ThemeToggle } from '@/src/components/Base/ThemeToggle'
import { buttonVariants } from '@/src/components/Base/Button'
import { siteConfig } from '@/src/config/site'
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu'

import toast from 'react-hot-toast'

export function TopMenuBar() {
  const { data: session } = useSession()

  return (
    <header className='bg-background sticky top-0 z-40 w-full border-b shadow-sm dark:border-gray-800'>
      <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <MainNav items={siteConfig.mainNav} />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-1'>
            <ThemeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none group'>
                  <div className='relative'>
                    <img
                      src={session.user?.image || '/icons/default_user_avatar2.png'}
                      alt={session.user.name || 'Root'}
                      className='h-8 w-8 rounded-full object-cover ring-2 ring-primary/30 transition-all duration-200 group-hover:ring-primary'
                    />
                    <span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900' />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='w-56 bg-background rounded-md shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 p-3 space-y-2 animate-fade-in dark:bg-gray-900'
                >
                  <div className='flex items-center gap-3 p-2'>
                    <img
                      src={session.user?.image || '/icons/default_user_avatar2.png'}
                      alt={session.user.name || 'Root'}
                      className='h-10 w-10 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-700'
                    />
                    <div className='flex flex-col'>
                      <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                        {session.user.name || 'Root'}
                      </p>
                    </div>
                  </div>
                  <div className='my-2 h-px bg-gray-200 dark:bg-gray-800' />
                  <DropdownMenuItem>
                    <Link
                      href='/profile'
                      className='flex w-full items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    >
                      <Icons.user className='h-4 w-4 text-gray-700 dark:text-gray-300' />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      signOut()
                    }}
                    className='flex w-full items-center gap-2 px-2 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer'
                  >
                    <Icons.logout className='h-4 w-4 text-red-600' />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href='/sign-in'>
                <div className={buttonVariants({ size: 'sm', variant: 'ghost' })}>
                  <span>Login</span>
                </div>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
