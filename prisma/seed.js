const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const { parse } = require('csv-parse')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

const FIRST_USER_EMAIL = process.env.FIRST_USER_EMAIL || 'admin@gmail.com'
const FIRST_USER_PASSWORD = process.env.FIRST_USER_PASSWORD || 'password'
const FIRST_USER_NAME = process.env.FIRST_USER_NAME || 'admin'

async function createSuperUser() {
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

createSuperUser()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

async function addEmbeddingsData() {
  const csvFilePath = path.resolve(__dirname, './embeddings.csv')
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' })

  const records = await new Promise((resolve, reject) => {
    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) reject(err)
        else resolve(records)
      },
    )
  })

  for (const record of records) {
    await prisma.embedding.create({
      data: {
        id: parseInt(record.id),
        context: record.context,
        response: record.response,
        semantic_vector: JSON.parse(record.semantic_vector),
      },
    })
  }

  console.log('Seed data inserted successfully')
}

addEmbeddingsData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
