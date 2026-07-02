import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'; // <-- Đã thêm Patch, Param, Delete vào đây
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart (Giỏ hàng)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    const userId = req.user.userId;
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  getCart(@Request() req: any) {
    const userId = req.user.userId; // Lấy id người dùng từ Token
    return this.cartService.getCart(userId);
  }

  @Patch('items/:id')
  updateCartItem(
    @Request() req: any,
    @Param('id') cartItemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const userId = req.user.userId;
    return this.cartService.updateCartItem(userId, cartItemId, dto.quantity);
  }

  @Delete('items/:id')
  removeCartItem(@Request() req: any, @Param('id') cartItemId: string) {
    const userId = req.user.userId;
    return this.cartService.removeCartItem(userId, cartItemId);
  }
}
