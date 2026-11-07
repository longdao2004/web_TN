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
   * Tạo URL thanh toán VNPay hoặc xác nhận COD (Hỗ trợ Đa gian hàng / Tách nhiều đơn hàng)
   */
  async createPaymentUrl(
    userId: string,
    createPaymentDto: CreatePaymentDto,
    ipAddr: string,
  ) {
    // 🟢 Thu thập toàn bộ danh sách mã đơn hàng cần thanh toán
    const targetOrderIds = Array.from(
      new Set([
        createPaymentDto.orderId,
        ...(createPaymentDto.orderIds || []),
      ]),
    ).filter(Boolean);

    // Truy vấn tất cả đơn hàng liên quan trong cơ sở dữ liệu
    const orders = await this.prisma.order.findMany({
      where: {
        id: { in: targetOrderIds },
      },
      include: { payment: true },
    });

    if (orders.length === 0) throw new NotFoundException('Đơn hàng không tồn tại');

    // Kiểm tra quyền sở hữu và trạng thái thanh toán của từng đơn
    for (const ord of orders) {
      if (ord.userId !== userId) {
        throw new BadRequestException('Không có quyền thanh toán đơn hàng này');
      }
      if (ord.payment && ord.payment.isSuccess) {
        throw new BadRequestException(
          `Đơn hàng ${ord.id} đã được thanh toán thành công từ trước`,
        );
      }
    }

    // 🟢 1. TRƯỜNG HỢP CHỌN COD (Thanh toán khi nhận hàng cho tất cả các đơn hàng con)
    if (createPaymentDto.provider === PaymentProvider.COD) {
      for (const ord of orders) {
        if (!ord.payment) {
          await this.prisma.payment.create({
            data: {
              orderId: ord.id,
              provider: PaymentProvider.COD,
              amount: ord.totalAmount,
              isSuccess: false, // Thanh toán khi nhận hàng nên mặc định false
            },
          });
        }
      }

      return {
        message:
          'Đã chọn phương thức thanh toán COD. Vui lòng thanh toán khi nhận hàng.',
        url: null,
      };
    }

    // 🟢 2. TRƯỜNG HỢP CHỌN VNPAY SANDBOX (Thanh toán gộp cho tất cả các đơn hàng con)
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

      // Tạo mã giao dịch tham chiếu duy nhất cho phiên thanh toán VNPay này
      // Nếu có 1 đơn, dùng orderId. Nếu nhiều đơn, sinh mã duy nhất PAY_{timestamp}_{random}
      const txnRef =
        orders.length === 1
          ? orders[0].id
          : `PAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Tính tổng tiền thanh toán của tất cả các đơn hàng con
      const totalAmount = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

      // Tạo hoặc cập nhật bản ghi Payment với mã giao dịch txnRef cho từng đơn hàng
      for (const ord of orders) {
        if (!ord.payment) {
          await this.prisma.payment.create({
            data: {
              orderId: ord.id,
              transactionId: txnRef, // Dùng chung mã txnRef để đối soát đồng bộ khi VNPay phản hồi
              provider: PaymentProvider.VNPAY,
              amount: ord.totalAmount,
              isSuccess: false,
            },
          });
        } else {
          await this.prisma.payment.update({
            where: { orderId: ord.id },
            data: {
              transactionId: txnRef,
              provider: PaymentProvider.VNPAY,
            },
          });
        }
      }

      const date = new Date();
      const createDate = this.formatVNPayDate(date);

      // Các tham số cấu hình VNPay
      let vnp_Params: any = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,
        vnp_OrderType: 'other',
        vnp_Amount: Math.round(totalAmount * 100), // VNPay bắt buộc nhân 100
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

      // Trả về URL để Frontend redirect sang cổng thanh toán của VNPay
      const finalUrl =
        vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
      return { url: finalUrl };
    }

    throw new BadRequestException('Phương thức thanh toán không được hỗ trợ');
  }

  /**
   * VNPay Callback: Nhận kết quả thanh toán từ VNPay và cập nhật tất cả đơn hàng liên quan
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
      const txnRef = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];

      // 🟢 Tìm tất cả bản ghi Payment thuộc về phiên thanh toán này (theo transactionId hoặc orderId)
      const payments = await this.prisma.payment.findMany({
        where: {
          OR: [
            { transactionId: txnRef },
            { orderId: txnRef },
          ],
        },
        include: { order: { include: { items: true } } },
      });

      if (payments.length === 0) {
        return { code: '99', message: 'Không tìm thấy thông tin đơn hàng thanh toán', orderId: txnRef };
      }

      const firstOrderId = payments[0].orderId;

      if (responseCode === '00') {
        // 🟢 Thanh toán thành công -> Cập nhật CSDL cho TẤT CẢ các đơn hàng con
        await this.prisma.$transaction(async (tx) => {
          for (const p of payments) {
            await tx.payment.update({
              where: { id: p.id },
              data: {
                isSuccess: true,
                transactionId: vnp_Params['vnp_TransactionNo'] || p.transactionId,
                paymentDate: new Date(),
              },
            });

            await tx.order.update({
              where: { id: p.orderId },
              data: { status: OrderStatus.PACKING }, // Chuyển trạng thái sang Đang đóng gói
            });
          }
        });

        return { code: '00', message: 'Thanh toán thành công', orderId: firstOrderId };
      } else {
        // 🟢 Thanh toán thất bại hoặc khách đã bấm Hủy trên cổng VNPay:
        // Tự động hoàn lại tồn kho và chuyển trạng thái TẤT CẢ đơn hàng con sang CANCELLED
        await this.prisma.$transaction(async (tx) => {
          for (const p of payments) {
            const ord = p.order;
            if (ord && ord.status === OrderStatus.PENDING) {
              await tx.order.update({
                where: { id: ord.id },
                data: { status: OrderStatus.CANCELLED },
              });

              for (const item of ord.items) {
                if (item.productBatchId) {
                  await tx.productBatch.update({
                    where: { id: item.productBatchId },
                    data: { quantity: { increment: item.quantity } },
                  });
                }
                await tx.product.update({
                  where: { id: item.productId },
                  data: { soldCount: { decrement: item.quantity } },
                });
              }
            }
          }
        });

        return {
          code: responseCode,
          message: 'Giao dịch bị hủy hoặc không thành công',
          orderId: firstOrderId,
        };
      }
    } else {
      return { code: '97', message: 'Chữ ký không hợp lệ (Dữ liệu bị chỉnh sửa)' };
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
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
        /%20/g,
        '+',
      );
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