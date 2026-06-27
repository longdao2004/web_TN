import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // Gửi mail chào mừng
  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Chào mừng đến với Nông Sản Sạch',
        html: `<h2>Xin chào ${name},</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống của chúng tôi.</p>
        <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</p>`,
      });
      console.log(`Đã gửi email chào mừng tới ${email}`);
    } catch (error) {
      console.error('Lỗi khi gửi email chào mừng:', error);
    }
  }

  // Gửi mail quên mật khẩu
  async sendForgotPasswordEmail(email: string, token: string) {
    try {
      const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'Yêu cầu khôi phục mật khẩu',
        html: `<h2>Yêu cầu khôi phục mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để thực hiện:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>`,
      });
      console.log(`Đã gửi email khôi phục mật khẩu tới ${email}`);
    } catch (error) {
      console.error('Lỗi khi gửi email khôi phục mật khẩu:', error);
    }
  }
}
