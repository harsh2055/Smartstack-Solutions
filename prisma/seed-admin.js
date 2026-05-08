const { PrismaClient } = require('../src/generated/prisma_new')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const email = 'harshs1929@gmail.com'
  const hashedPassword = await bcrypt.hash('password', 12)
  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })
  console.log('User upgraded to ADMIN:', user.email)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
