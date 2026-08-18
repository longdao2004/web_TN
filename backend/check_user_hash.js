const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'longdao@gmail.com' }
  });
  console.log("HASH: ", user.password);
}
checkUser().finally(() => prisma.$disconnect());
