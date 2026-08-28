import prisma from '../lib/prisma'

const rawEmail = process.argv[2]

if (!rawEmail) {
  console.error(
    'Usage: npx tsx src/scripts/makeResponder.ts email@example.com',
  )

  process.exit(1)
}

const email = rawEmail

async function main() {
  const normalizedEmail =
    email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  })

  if (!user) {
    console.error(
      `User not found: ${normalizedEmail}`,
    )

    process.exit(1)
  }

  const responder = await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      role: 'RESPONDER',
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  })

  console.log('Responder account ready:')
  console.log(responder)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })