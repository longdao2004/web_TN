const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'longdao@gmail.com' }
  });
  console.log("PASSWORD HASH: ", user.password ? "EXISTS" : "NULL/EMPTY");
  console.log("ROLE: ", user.role);
}
checkUser().finally(() => prisma.$disconnect());
