import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    // Nếu đã có thì đảm bảo role là ADMIN
    const updated = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log('✅ Tài khoản Admin đã tồn tại và đã được cập nhật Role: ADMIN');
    console.log(`Email: ${updated.email} | Role: ${updated.role}`);
  } else {
    // Nếu chưa có thì tạo mới
    const newAdmin = await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('123456', 10),
        fullName: 'Quản Trị Viên Hệ Thống',
        phone: '0988888888',
        address: 'Hà Nội',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=059669&color=fff',
        role: 'ADMIN',
      },
    });
    console.log('🎉 Đã tạo thành công tài khoản Admin mới vào Database!');
    console.log(`Email: ${newAdmin.email} | Mật khẩu: 123456 | Role: ${newAdmin.role}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
