import { Message } from '@/src/validation/chat'
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/src/lib/auth'
import prisma from '@/prisma/client'

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const id = params.get('id')

  const session = await getUser()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (id) {
    const data = await prisma.conversation.findUnique({
      where: {
        id,
      },
    })

    if (!data) return NextResponse.json({ error: 'No conversation found' }, { status: 404 })
    const { messages } = data

    return NextResponse.json({
      data: messages,
    })
  } else {
    const data = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        conversations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!data) return NextResponse.json({ error: 'No user found' }, { status: 404 })
    const { conversations } = data

    return NextResponse.json({
      data: conversations,
    })
  }
}

// export async function POST(req: NextRequest) {
//   const { message, messageId, id } = await req.json()

//   const responseMessage = await createCompletion(message)
//   const scrapedData = scrapeData()
//   const summary = createSummary()
//   const actions = createActions()

//   const newAIResponseId = generateRandomId(8)
//   const newMessageJson: Message[] = [
//     {
//       id: messageId,
//       role: 'user',
//       content: {
//         text: message,
//       },
//     },
//     {
//       id: newAIResponseId,
//       role: 'assistant',
//       content: {
//         text: responseMessage.content!,
//         scrapedData,
//         summary,
//         actions,
//       },
//     },
//   ]

//   if (id) {
//     try {
//       const dataRef = await prisma.conversation.findUnique({
//         where: {
//           id,
//         },
//       })

//       const updateMessageJson = [...dataRef.messages, ...newMessageJson]

//       await prisma.conversation.update({
//         where: {
//           id,
//         },
//         data: {
//           messages: updateMessageJson,
//         },
//       })

//       return NextResponse.json({
//         data: newMessageJson[1],
//       })
//     } catch (error) {
//       console.error('Error generating response:', error)

//       return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//     }
//   } else {
//     try {
//       const session = await getUser()
//       if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//       const dataRef = await prisma.conversation.create({
//         data: {
//           messages: newMessageJson,
//           name: message,
//           userId: session?.user.id,
//         },
//       })

//       return NextResponse.json({
//         id: dataRef.id,
//         name: dataRef.name,
//       })
//     } catch (error) {
//       console.error('Error generating response:', error)

//       return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//     }
//   }
// }
