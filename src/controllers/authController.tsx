import prisma from '@/prisma/client'
import bcrypt from 'bcrypt'

export const verifyPassword = async (password: string, hashedPassword: string) => {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return {
        success: false,
        message: 'User not found with this email',
      }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid credentials',
      }
    }

    // Return user data without sensitive information
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
    }
  } catch (error) {
    console.error('Error during sign in:', error)
    return {
      success: false,
      message: 'Authentication failed',
    }
  }
}

export const signOut = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email },
    })
  } catch (error) {
    console.error('Error finding user by email:', error)
    return null
  }
}
