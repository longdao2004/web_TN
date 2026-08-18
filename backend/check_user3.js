const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'longdao@gmail.com' }
  });
  const match = await bcrypt.compare('123456', user.password);
  console.log("MATCHES 123456? ", match);
}
checkUser().finally(() => prisma.$disconnect());
