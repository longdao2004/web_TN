// backend/prisma/delete-user.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUserByEmail(email) {
  if (!email) {
    console.log('⚠️  Vui lòng truyền email cần xóa. Ví dụ: node prisma/delete-user.js daolong100104@gmail.com');
    return;
  }

  const user = await prisma.user.findFirst({
    where: { 
      email: {
        equals: email.trim(),
        mode: 'insensitive',
      }
    },
    include: {
      store: {
        include: {
          products: true,
        },
      },
      cart: {
        include: {
          items: true,
        },
      },
      orders: {
        include: {
          items: true,
          payment: true,
        },
      },
      reviews: true,
    },
  });

  if (!user) {
    console.log(`❌ Không tìm thấy user nào có email: "${email}"`);
    return;
  }

  if (user.role === 'ADMIN') {
    console.log('⛔ CẢNH BÁO: Đây là tài khoản ADMIN hệ thống, không được phép xóa!');
    return;
  }

  if (user.store && user.store.products.length > 0) {
    console.log(`⛔ CẢNH BÁO: User này là chủ cửa hàng "${user.store.name}" và đang có ${user.store.products.length} sản phẩm. Không thể xóa để tránh làm hỏng dữ liệu sàn.`);
    return;
  }

  console.log(`⏳ Đang tiến hành xóa dọn dẹp tài khoản: "${user.fullName}" (${user.email})...`);

  // 1. Dọn giỏ hàng (Cart & CartItems)
  if (user.cart) {
    if (user.cart.items.length > 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: user.cart.id },
      });
    }
    await prisma.cart.delete({
      where: { id: user.cart.id },
    });
    console.log('- Đã xóa giỏ hàng.');
  }

  // 2. Dọn đánh giá (Reviews)
  if (user.reviews.length > 0) {
    await prisma.review.deleteMany({
      where: { userId: user.id },
    });
    console.log(`- Đã xóa ${user.reviews.length} đánh giá.`);
  }

  // 3. Dọn đơn hàng & thanh toán (Orders, OrderItems, Payments)
  if (user.orders.length > 0) {
    for (const order of user.orders) {
      if (order.payment) {
        await prisma.payment.delete({
          where: { orderId: order.id },
        });
      }
      await prisma.orderItem.deleteMany({
        where: { orderId: order.id },
      });
    }
    await prisma.order.deleteMany({
      where: { userId: user.id },
    });
    console.log(`- Đã xóa ${user.orders.length} đơn hàng liên quan.`);
  }

  // 4. Nếu có gian hàng rỗng (không có sản phẩm), xóa gian hàng
  if (user.store) {
    await prisma.store.delete({
      where: { id: user.store.id },
    });
    console.log(`- Đã xóa gian hàng rỗng "${user.store.name}".`);
  }

  // 5. Xóa vĩnh viễn User khỏi database
  await prisma.user.delete({
    where: { id: user.id },
  });

  console.log(`\n🎉 THÀNH CÔNG! Đã xóa vĩnh viễn tài khoản: ${user.email} (SĐT: ${user.phone || 'Không có'}).`);
  console.log(`👉 Bây giờ bạn có thể dùng Email "${user.email}" hoặc SĐT "${user.phone}" để test đăng ký mới tại trang /dang-ky.`);
}

const targetEmail = process.argv[2];
deleteUserByEmail(targetEmail)
  .catch((err) => {
    console.error('❌ Lỗi khi xóa:', err.message);
  })
  .finally(() => prisma.$disconnect());
