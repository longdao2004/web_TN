const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'longdao@gmail.com' }
  });
  console.log(user ? "USER EXISTS: " + user.email : "USER NOT FOUND");
  const allUsers = await prisma.user.findMany({ select: { email: true }});
  console.log("AVAILABLE USERS:", allUsers);
}
checkUser().finally(() => prisma.$disconnect());
