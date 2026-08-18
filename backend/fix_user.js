const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function fixUser() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.updateMany({
    data: { password: hashedPassword }
  });
  console.log("Updated all users with password '123456' properly hashed.");
}
fixUser().finally(() => prisma.$disconnect());
