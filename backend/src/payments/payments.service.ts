import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentProvider, OrderStatus } from '@prisma/client';
import * as crypto from 'crypto';
import * as qs from 'qs';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Tạo URL thanh toán VNPay hoặc xác nhận COD
   */
  async createPaymentUrl(
    userId: string,
    createPaymentDto: CreatePaymentDto,
    ipAddr: string,
  ) {
    // Kiểm tra đơn hàng
    const order = await this.prisma.order.findUnique({
      where: { id: createPaymentDto.orderId },
      include: { payment: true },
    });

    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    if (order.userId !== userId)
      throw new BadRequestException('Không có quyền thanh toán đơn hàng này');
    if (order.payment && order.payment.isSuccess)
      throw new BadRequestException(
        'Đơn hàng đã được thanh toán thành công từ trước',
      );

    // 1. Trường hợp chọn COD (Thanh toán khi nhận hàng)
    if (createPaymentDto.provider === PaymentProvider.COD) {
      if (!order.payment) {
        await this.prisma.payment.create({
          data: {
            orderId: order.id,
            provider: PaymentProvider.COD,
            amount: order.totalAmount,
            isSuccess: false, // Thanh toán khi nhận hàng nên mặc định false
          },
        });
      }
      return {
        message:
          'Đã chọn phương thức thanh toán COD. Vui lòng thanh toán khi nhận hàng.',
        url: null,
      };
    }

    // 2. Trường hợp chọn VNPay Sandbox
    if (createPaymentDto.provider === PaymentProvider.VNPAY) {
      const tmnCode = this.configService.get<string>('VNPAY_TMNCODE');
      const secretKey = this.configService.get<string>('VNPAY_HASHSECRET');
      const vnpUrl = this.configService.get<string>('VNPAY_URL');
      const returnUrl = this.configService.get<string>('VNPAY_RETURN_URL');

      if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
        throw new BadRequestException(
          'Hệ thống chưa cấu hình môi trường VNPay Sandbox trong file .env',
        );
      }

      // Tạo hoặc cập nhật bản ghi Payment pending
      if (!order.payment) {
        await this.prisma.payment.create({
          data: {
            orderId: order.id,
            provider: PaymentProvider.VNPAY,
            amount: order.totalAmount,
            isSuccess: false,
          },
        });
      } else {
        await this.prisma.payment.update({
          where: { orderId: order.id },
          data: { provider: PaymentProvider.VNPAY },
        });
      }

      const date = new Date();
      const createDate = this.formatVNPayDate(date);
      const txnRef = order.id; // Dùng OrderID làm mã giao dịch VNPay

      // Các tham số cấu hình VNPay
      let vnp_Params: any = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: 'Thanh toan don hang ' + order.id,
        vnp_OrderType: 'other',
        vnp_Amount: order.totalAmount * 100, // VNPay bắt buộc nhân 100
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };

      // VNPay yêu cầu phải sort params theo alphabet
      vnp_Params = this.sortObject(vnp_Params);

      // Ký dữ liệu
      const signData = qs.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;

      // Trả về URL để Frontend redirect sang trang thanh toán của VNPay
      const finalUrl =
        vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
      return { url: finalUrl };
    }

    throw new BadRequestException('Phương thức thanh toán không được hỗ trợ');
  }

  /**
   * VNPay Callback: Nhận kết quả thanh toán từ VNPay
   */
  async vnpayReturn(vnpayParams: any) {
    let vnp_Params = { ...vnpayParams };
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa hash ra khỏi data để chuẩn bị ký lại kiểm tra
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);

    const secretKey = this.configService.get<string>('VNPAY_HASHSECRET');
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey || '');
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Kiểm tra tính toàn vẹn của dữ liệu (ngăn chặn hacker sửa URL)
    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];

      if (responseCode === '00') {
        // Thanh toán thành công -> Cập nhật CSDL
        await this.prisma.$transaction(async (prisma) => {
          await prisma.payment.update({
            where: { orderId: orderId },
            data: {
              isSuccess: true,
              transactionId: vnp_Params['vnp_TransactionNo'],
              paymentDate: new Date(),
            },
          });

          await prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.PACKING }, // Chuyển trạng thái sang Đang đóng gói
          });
        });

        return { code: '00', message: 'Thanh toán thành công' };
      } else {
        return {
          code: responseCode,
          message: 'Thanh toán thất bại hoặc khách hàng đã hủy',
        };
      }
    } else {
      return { code: '97', message: 'Chữ ký không hợp lệ (Checksum failed)' };
    }
  }

  // --- HÀM HELPER HỖ TRỢ VNPAY ---

  private sortObject(obj: any): any {
    const sorted: any = {};
    const str: string[] = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  private formatVNPayDate(date: Date) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }
}
