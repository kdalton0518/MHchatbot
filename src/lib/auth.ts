import prisma from '@/prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthOptions, DefaultSession, getServerSession } from 'next-auth'
import { DefaultJWT, JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      access_token: string
      token_type: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken: string
    tokenType: string
  }
}

export const authConfig: AuthOptions = {
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/error',
  },
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    // Credentials Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        // const user = {
        //   id: 'cm5r233hb0000kee8idgbfntn',
        //   email: 'admin@gmail.com',
        //   password: '$2b$10$55lnfWh.b.47xc2DJmgoEO54t3TSJccyknvZKa9DyDE/UwTWMqaW2',
        //   name: 'admin',
        //   image: null,
        //   created_at: '2025-01-10T17:53:32.256Z',
        //   updated_at: '2025-01-10T17:53:32.256Z',
        // }

        if (credentials.email != user.email || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return user
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user: any }) => {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.accessToken = generateAccessToken(user)
        token.tokenType = 'Bearer'
      }

      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        })

        if (dbUser) {
          token.sub = dbUser.id
        }
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub as string
        session.user.email = token.email as string
        session.user.name = token.name as string | null
        session.user.image = token.picture as string | null
        session.user.access_token = token.accessToken as string
        session.user.token_type = token.tokenType as string
      }

      return session
    },
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: '.vercel.app', // Adjust this based on your domain
      },
    },
  },
}
// Generate Access Token
function generateAccessToken(user: any): string {
  const secret = process.env.NEXTAUTH_SECRET!
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret,
    { expiresIn: '2h' },
  )
}

// Helper Function to Get Server Session
export async function getUser() {
  return await getServerSession(authConfig)
}
