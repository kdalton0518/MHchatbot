import Link from 'next/link'
import * as React from 'react'

import { Icons } from '@/src/components/Base/Icons'
import { siteConfig } from '@/src/config/site'
import { cn } from '@/src/lib/utils'

interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className='flex gap-6 md:gap-10'>
      <Link
        href='/'
        className='flex items-center space-x-2 transition-colors duration-200 hover:text-primary'
      >
        <Icons.logo className='h-6 w-6' />
        <span className='inline-block font-bold'>{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className='flex gap-6'>
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'text-muted-foreground flex items-center text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105',
                    item.disabled && 'cursor-not-allowed opacity-80 hover:scale-100',
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  )
}
