const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const FIRST_USER_EMAIL = process.env.FIRST_USER_EMAIL || 'admin@example.com'
const FIRST_USER_PASSWORD = process.env.FIRST_USER_PASSWORD || 'password'
const FIRST_USER_NAME = process.env.FIRST_USER_NAME || 'admin'

async function main() {
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    console.log('Users already exist. Skipping seed.')
    return
  }

  const hashedPassword = await bcrypt.hash(FIRST_USER_PASSWORD, 10)
  const firstUser = await prisma.user.create({
    data: {
      email: FIRST_USER_EMAIL,
      password: hashedPassword,
      name: FIRST_USER_NAME,
    },
  })
  console.log('Created first user:', firstUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
