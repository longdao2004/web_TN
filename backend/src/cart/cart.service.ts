import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    // 1. Kiểm tra xem Sản phẩm có tồn tại trong Database không
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        'Sản phẩm nông sản này không tồn tại hoặc đã bị xóa!',
      );
    }

    // 2. Tìm giỏ hàng của User này (nếu chưa có thì tự động tạo mới 1 cái giỏ trống)
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // 3. Kiểm tra xem sản phẩm này đã có sẵn trong giỏ chưa
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existingItem) {
      // 3a. Nếu có rồi -> Cộng dồn số lượng
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      // 3b. Nếu chưa có -> Tạo mới một dòng CartItem
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }
  }

  /**
   * HÀM LẤY CHI TIẾT GIỎ HÀNG & TÍNH TỔNG TIỀN
   */
  async getCart(userId: string) {
    // 1. Tìm giỏ hàng của User, lấy kèm các mặt hàng (items), thông tin sản phẩm (product)
    // và các lô hàng (batches) của sản phẩm đó để lấy giá tiền.
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                batches: {
                  orderBy: { createdAt: 'desc' }, // Lấy lô hàng mới nhất lên đầu
                },
              },
            },
          },
        },
      },
    });

    // 2. Nếu user chưa có giỏ hàng nào trong DB, trả về cấu trúc giỏ trống luôn
    if (!cart || cart.items.length === 0) {
      return {
        cartId: cart?.id || null,
        items: [],
        totalAmount: 0,
      };
    }

    // 3. Duyệt qua từng món đồ để tính toán giá tiền động từ Lô hàng (ProductBatch)
    const formattedItems = cart.items.map((item) => {
      // Lấy lô hàng mới nhất của sản phẩm này
      const latestBatch = item.product.batches[0];
      // Nếu lô hàng có giá thì lấy giá đó, không thì mặc định bằng 0
      const currentPrice = latestBatch ? latestBatch.price : 0;

      return {
        cartItemId: item.id,
        productId: item.productId,
        productName: item.product.name,
        imageUrl: item.product.imageUrl,
        unit: item.product.unit,
        quantity: item.quantity,
        pricePerUnit: currentPrice,
        subTotal: currentPrice * item.quantity, // Thành tiền của món này
      };
    });

    // 4. Cộng tổng tiền của cả giỏ hàng
    const totalAmount = formattedItems.reduce(
      (sum, item) => sum + item.subTotal,
      0,
    );

    return {
      cartId: cart.id,
      items: formattedItems,
      totalAmount: totalAmount,
    };
  }

  /**
   * HÀM CẬP NHẬT SỐ LƯỢNG MÓN HÀNG
   */
  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    // Tìm giỏ hàng của User
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');

    // Kiểm tra xem món hàng đó có nằm trong giỏ của User này không (Bảo mật)
    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException('Món hàng không có trong giỏ');

    // Tiến hành cập nhật số lượng
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  /**
   * HÀM XÓA MÓN HÀNG KHỎI GIỎ
   */
  async removeCartItem(userId: string, cartItemId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');

    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException('Món hàng không có trong giỏ');

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }
}
