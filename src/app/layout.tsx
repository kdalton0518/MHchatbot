import { siteConfig } from '@/src/config/site'
import { fontSans } from '@/src/lib/fonts'
import { cn } from '@/src/lib/utils'
import { NextAuthProvider } from '@/src/providers/sessionProvider'
import { ThemeProvider } from '@/src/providers/themeProvider'
import '@/src/styles/globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('bg-background min-h-screen font-sans antialiased', fontSans.variable)}>
        <NextAuthProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Toaster position='top-right' />
            <main>{children}</main>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
