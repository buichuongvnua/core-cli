const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { supperAdmin, realEstates } = require('./seeddata')

async function main() {
  await prisma.user.upsert({
    where: { username: supperAdmin.username },
    update: { ...supperAdmin },
    create: { ...supperAdmin },
  })
  for (let item of realEstates) {
    await prisma.realEstate.upsert({
      where: { code: item.code },
      update: { ...item },
      create: { ...item },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Finish run seed')
    await prisma.$disconnect()
  })
