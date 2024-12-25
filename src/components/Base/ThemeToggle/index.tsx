'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'
import { Icons } from '@/src/components/Base/Icons'
import { Button } from '@/src/components/Base/Button'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant='ghost'
      size='sm'
      className='bg-gradient-to-br from-green-50 to-green-50 dark:from-black dark:to-black hover:bg-gradient-to-br hover:from-green-50 hover:to-green-50 dark:hover:from-black dark:hover:to-black'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Icons.sun className='rotate-0 scale-100 transition-transform hover:scale-110 dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-white' />
      <Icons.moon className='absolute rotate-90 scale-0 transition-transform hover:scale-110 dark:rotate-0 dark:scale-100 text-gray-700 dark:text-white' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
