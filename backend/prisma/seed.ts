import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang dọn dẹp Database...');
  await prisma.productBatch.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Bắt đầu tạo 5 bộ dữ liệu mẫu (Full thông tin)...');

  // Danh sách 5 bộ dữ liệu đã được cá nhân hóa và điền đầy đủ
  const seedData = [
    {
      user: { fullName: 'Đào Tất Long', email: 'longdao@gmail.com', phone: '0901234567', address: 'Hà Nội' },
      store: { name: 'Nông sản Thủ Đô', desc: 'Chuyên cung cấp rau củ sạch khu vực nội thành.' },
      category: { name: 'Rau ăn lá', desc: 'Các loại rau xanh thu hoạch trong ngày.' },
      product: { name: 'Rau muống VietGAP', origin: 'Đông Anh, Hà Nội', unit: 'mớ', price: 15000, qty: 200 }
    },
    {
      user: { fullName: 'Trần Thị Bích', email: 'bichtran@gmail.com', phone: '0912345678', address: 'Đà Lạt, Lâm Đồng' },
      store: { name: 'Dalat Fresh', desc: 'Trái cây xứ lạnh cao cấp.' },
      category: { name: 'Trái cây', desc: 'Hoa quả tươi mọng nước.' },
      product: { name: 'Dâu tây New Zealand', origin: 'Cầu Đất, Đà Lạt', unit: 'hộp', price: 120000, qty: 50 }
    },
    {
      user: { fullName: 'Lê Văn Cường', email: 'cuongle@gmail.com', phone: '0923456789', address: 'Cao Phong, Hòa Bình' },
      store: { name: 'Vườn Cam Cường Phát', desc: 'Nhà vườn trồng cam chuẩn hữu cơ.' },
      category: { name: 'Đặc sản vùng miền', desc: 'Nông sản thế mạnh của từng địa phương.' },
      product: { name: 'Cam Canh Cao Phong', origin: 'Hòa Bình', unit: 'kg', price: 45000, qty: 500 }
    },
    {
      user: { fullName: 'Phạm Thu Hương', email: 'huongpham@gmail.com', phone: '0934567890', address: 'Lục Ngạn, Bắc Giang' },
      store: { name: 'Hợp tác xã Vải Thiều', desc: 'Phân phối vải thiều sấy khô và tươi.' },
      category: { name: 'Nông sản sấy', desc: 'Trái cây và rau củ sấy khô bảo quản lâu.' },
      product: { name: 'Vải thiều sấy khô', origin: 'Lục Ngạn, Bắc Giang', unit: 'kg', price: 85000, qty: 150 }
    },
    {
      user: { fullName: 'Hoàng Minh Tuấn', email: 'tuanhoang@gmail.com', phone: '0945678901', address: 'Mộc Châu, Sơn La' },
      store: { name: 'Mộc Châu Xanh', desc: 'Trang trại bò sữa và nông sản sạch.' },
      category: { name: 'Sản phẩm từ sữa', desc: 'Sữa tươi, váng sữa và bơ.' },
      product: { name: 'Sữa tươi thanh trùng', origin: 'Mộc Châu, Sơn La', unit: 'lít', price: 35000, qty: 80 }
    }
  ];

  for (let i = 0; i < seedData.length; i++) {
    const data = seedData[i];

    // 1. Tạo Category
    const category = await prisma.category.create({
      data: {
        name: data.category.name,
        description: data.category.desc,
      }
    });

    // 2. Tạo User (Chủ vườn) với đầy đủ thông tin
    const user = await prisma.user.create({
      data: {
        email: data.user.email,
        password: '123456_hashed',
        fullName: data.user.fullName,
        phone: data.user.phone,
        address: data.user.address,
        avatarUrl: `https://ui-avatars.com/api/?name=${data.user.fullName.replace(/ /g, '+')}&background=random`,
        role: 'SELLER',
      }
    });

    // 3. Tạo Store liên kết với User
    const store = await prisma.store.create({
      data: {
        name: data.store.name,
        description: data.store.desc,
        logoUrl: `https://ui-avatars.com/api/?name=${data.store.name.replace(/ /g, '+')}&background=random`,
        ownerId: user.id,
      }
    });

    // 4. Tạo Product lồng với ProductBatch
    await prisma.product.create({
      data: {
        name: data.product.name,
        description: `Sản phẩm ${data.product.name} được canh tác và phân phối trực tiếp từ nhà vườn.`,
        imageUrl: `https://picsum.photos/seed/nongsan${i}/400/400`,
        origin: data.product.origin,
        unit: data.product.unit,
        soldCount: Math.floor(Math.random() * 50),
        isActive: true,
        categoryId: category.id,
        storeId: store.id,
        batches: {
          create: {
            harvestDate: new Date(),
            // Hạn sử dụng: 30 ngày kể từ hôm nay
            expiryDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), 
            quantity: data.product.qty,
            price: data.product.price,
          }
        }
      }
    });
  }

  console.log('✅ Chạy Seed thành công! Database đã có 5 bộ dữ liệu không null.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });