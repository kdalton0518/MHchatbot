import Link from 'next/link'

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
    <div className='flex gap-6 md:gap-10 dark:bg-black'>
      <Link
        href='/'
        className='flex items-center space-x-2 transition-colors duration-200 hover:text-primary dark:text-white'
      >
        <Icons.logo className='h-6 w-6 dark:text-white' />
        <span className='inline-block font-bold dark:text-white'>{siteConfig.name}</span>
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
                    'text-gray-800 flex items-center text-sm font-medium transition-all duration-200 hover:text-gray-900 hover:scale-105 dark:text-gray-200 dark:hover:text-white',
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
