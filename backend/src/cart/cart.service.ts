import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    if (dto.quantity <= 0) {
      throw new BadRequestException('Số lượng thêm vào giỏ phải lớn hơn 0!');
    }

    // 1. Kiểm tra Sản phẩm có tồn tại và đang kinh doanh không
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, deletedAt: null },
      include: {
        batches: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(
        'Sản phẩm nông sản này không tồn tại hoặc đã ngừng kinh doanh!',
      );
    }

    // 2. Lấy lô hàng mới nhất để kiểm tra hạn sử dụng và tồn kho
    const latestBatch = product.batches[0];
    if (!latestBatch) {
      throw new BadRequestException('Sản phẩm hiện chưa có lô hàng để bán!');
    }

    if (new Date(latestBatch.expiryDate).getTime() <= Date.now()) {
      throw new BadRequestException(
        'Sản phẩm này đã hết hạn sử dụng, không thể thêm vào giỏ hàng!',
      );
    }

    // 3. Tìm giỏ hàng của User
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // 4. Kiểm tra tồn kho trước khi thêm hoặc cộng dồn
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    const targetQuantity = (existingItem?.quantity || 0) + dto.quantity;
    if (latestBatch.quantity < targetQuantity) {
      throw new BadRequestException(
        `Số lượng trong giỏ sẽ vượt quá tồn kho hiện tại (kho chỉ còn ${latestBatch.quantity})!`,
      );
    }

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: targetQuantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                store: true,
                batches: {
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        cartId: cart?.id || null,
        items: [],
        totalAmount: 0,
      };
    }

    const formattedItems = cart.items.map((item) => {
      const latestBatch = item.product.batches[0];
      const currentPrice = latestBatch ? latestBatch.price : 0;

      return {
        cartItemId: item.id,
        productId: item.productId,
        productName: item.product.name,
        imageUrl: item.product.imageUrl,
        unit: item.product.unit,
        quantity: item.quantity,
        pricePerUnit: currentPrice,
        subTotal: currentPrice * item.quantity,
        store: item.product.store
          ? {
              id: item.product.store.id,
              name: item.product.store.name,
              slug: item.product.store.id,
            }
          : {
              id: 'unknown',
              name: 'Cửa hàng nông sản',
              slug: 'cua-hang',
            },
      };
    });

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

  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0!');
    }

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');

    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
      include: {
        product: {
          include: { batches: { orderBy: { createdAt: 'desc' } } },
        },
      },
    });
    if (!item) throw new NotFoundException('Món hàng không có trong giỏ');

    const latestBatch = item.product.batches[0];
    if (latestBatch && latestBatch.quantity < quantity) {
      throw new BadRequestException(
        `Số lượng vượt quá tồn kho hiện có (kho còn ${latestBatch.quantity})!`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

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