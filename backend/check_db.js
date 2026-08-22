const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const models = ['user', 'store', 'category', 'product', 'productBatch', 'certificate', 'cart', 'cartItem', 'order', 'orderItem', 'payment', 'review'];
  const results = {};
  for (const model of models) {
    results[model] = await prisma[model].count();
  }
  console.log('--- DB COUNTS ---');
  console.table(results);
  const sample = await prisma.product.findFirst({ select: { name: true, imageUrl: true }});
  console.log('Sample Image:', sample);
  await prisma.$disconnect();
}
main();
