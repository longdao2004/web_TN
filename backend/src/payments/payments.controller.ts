import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create-url')
  @ApiOperation({
    summary: 'Tạo URL thanh toán VNPay hoặc xác nhận thanh toán COD',
  })
  createPaymentUrl(
    @Req() req: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    // Lấy IP người dùng theo chuẩn yêu cầu của VNPay
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    return this.paymentsService.createPaymentUrl(
      req.user.userId,
      createPaymentDto,
      ipAddr,
    );
  }

  // VNPay sẽ tự động gọi tới endpoint này sau khi khách hàng quẹt thẻ
  @Get('vnpay-return')
  @ApiOperation({
    summary:
      'Webhook/Callback khi VNPay trả về kết quả (Dùng nội bộ hệ thống hoặc redirect về FE)',
  })
  async vnpayReturn(@Query() query: any, @Res() res: any) {
    const result = await this.paymentsService.vnpayReturn(query);
    
    // Redirect về Frontend hiển thị trang thành công / thất bại
    return res.redirect(`http://localhost:3001/dat-hang-thanh-cong?code=${result.code}&message=${encodeURIComponent(result.message)}&orderId=${result.orderId || ''}`);
  }
}
