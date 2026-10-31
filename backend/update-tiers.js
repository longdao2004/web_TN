const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLogisticsTiers() {
  console.log('🔄 Đang tự động phân loại sản phẩm theo đặc thù sinh học...\n');

  // 1. Nhóm Siêu tươi (ULTRA_FRESH): Sữa thanh trùng, sữa tươi, sữa bò, sữa dê, rau tươi, thịt, cá
  const ultraFresh = await prisma.product.updateMany({
    where: {
      OR: [
        { name: { contains: 'thanh trùng', mode: 'insensitive' } },
        { name: { contains: 'sữa bò', mode: 'insensitive' } },
        { name: { contains: 'sữa dê', mode: 'insensitive' } },
        { name: { contains: 'rau', mode: 'insensitive' } },
      ],
    },
    data: { logisticsTier: 'ULTRA_FRESH' },
  });

  // 2. Nhóm Bảo quản mát (CHILLED): Toàn bộ trái cây tươi & sữa chua (Nhiệt độ 2°C - 8°C)
  const chilled = await prisma.product.updateMany({
    where: {
      OR: [
        { category: { name: 'Hoa quả vùng miền' } },
        { name: { contains: 'sữa chua', mode: 'insensitive' } },
        { name: { contains: 'cam', mode: 'insensitive' } },
        { name: { contains: 'bơ', mode: 'insensitive' } },
        { name: { contains: 'dâu', mode: 'insensitive' } },
        { name: { contains: 'dưa hấu', mode: 'insensitive' } },
      ],
    },
    data: { logisticsTier: 'CHILLED' },
  });

  // 3. Nhóm Hàng khô (DRY_STABLE): Nông sản sấy, gạo, các loại hạt
  const dryStable = await prisma.product.updateMany({
    where: {
      OR: [
        { category: { name: 'Nông sản sấy' } },
        { name: { contains: 'sấy', mode: 'insensitive' } },
      ],
    },
    data: { logisticsTier: 'DRY_STABLE' },
  });

  console.log('🎉 CẬP NHẬT HOÀN TẤT:');
  console.log(`- Nhóm Siêu tươi (ULTRA_FRESH): ${ultraFresh.count} sản phẩm`);
  console.log(`- Nhóm Bảo quản mát (CHILLED): ${chilled.count} sản phẩm`);
  console.log(`- Nhóm Nông sản khô (DRY_STABLE): ${dryStable.count} sản phẩm`);

  // Hiển thị bảng tổng hợp để bạn kiểm tra trực quan
  const products = await prisma.product.findMany({
    select: {
      name: true,
      logisticsTier: true,
    },
    orderBy: { logisticsTier: 'asc' },
  });

  console.log('\n📋 DANH SÁCH SẢN PHẨM SAU KHI PHÂN LOẠI:');
  console.table(products);
}

updateLogisticsTiers()
  .catch((err) => {
    console.error('❌ Lỗi cập nhật:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });