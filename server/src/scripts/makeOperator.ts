import prisma from '../lib/prisma'

const email = process.argv[2]

if (!email) {
  console.error(
    'Usage: npx tsx src/scripts/makeOperator.ts email@example.com',
  )

  process.exit(1)
}

const user = await prisma.user.update({
  where: {
    email: email.trim().toLowerCase(),
  },

  data: {
    role: 'OPERATOR',
  },
})

console.log(
  `${user.email} is now an OPERATOR`,
)

process.exit(0)