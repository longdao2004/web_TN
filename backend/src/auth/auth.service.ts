import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  /**
   * ĐĂNG KÝ BẰNG EMAIL
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
        role: 'BUYER',
      },
    });

    // Bổ sung: Gọi MailService để gửi email chào mừng sau khi đăng ký thành công
    await this.mailService.sendWelcomeEmail(user.email, user.fullName);

    return { message: 'Đăng ký tài khoản thành công!', userId: user.id };
  }

  /**
   * ĐĂNG NHẬP BẰNG EMAIL
   */
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // Nếu user đăng ký bằng Google (password = null) mà cố login thường sẽ bị từ chối
    if (!user || !user.password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập thành công!',
      accessToken: accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  /**
   * ĐĂNG NHẬP / ĐĂNG KÝ BẰNG GOOGLE
   */
  async googleLogin(reqUser: any) {
    if (!reqUser) {
      throw new BadRequestException('Không tìm thấy dữ liệu từ Google');
    }

    // Kiểm tra xem user đã tồn tại chưa
    let user = await this.prisma.user.findUnique({
      where: { email: reqUser.email },
    });

    if (!user) {
      // Nếu chưa, tạo user mới liên kết với Google. (Lưu ý: password bị bỏ trống)
      user = await this.prisma.user.create({
        data: {
          email: reqUser.email,
          fullName: reqUser.fullName,
          googleId: reqUser.googleId,
          avatarUrl: reqUser.avatarUrl,
          role: 'BUYER',
        },
      });
      // Bổ sung: Gửi email chào mừng cho user đăng ký qua Google
      await this.mailService.sendWelcomeEmail(user.email, user.fullName);
    } else if (!user.googleId) {
      // Nếu user đã đăng ký bằng Email thường, cập nhật thêm googleId vào DB
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: reqUser.googleId },
      });
    }

    // Tạo JWT token trả về cho Client
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập Google thành công!',
      accessToken: accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  /**
   * QUÊN MẬT KHẨU
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      // Vì lý do bảo mật, không trả về lỗi "không tìm thấy email" để tránh bị dò quét email
      return {
        message:
          'Nếu email tồn tại, link khôi phục mật khẩu sẽ được gửi đến hộp thư của bạn.',
      };
    }

    // Tạo chuỗi token ngẫu nhiên và lưu vào Database
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // Có hiệu lực 15 phút

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
      },
    });

    // Bổ sung: Gửi email chứa token khôi phục
    await this.mailService.sendForgotPasswordEmail(user.email, resetToken);

    return {
      message:
        'Nếu email tồn tại, link khôi phục mật khẩu sẽ được gửi đến hộp thư của bạn.',
    };
  }

  /**
   * ĐẶT LẠI MẬT KHẨU
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Tìm user sở hữu token và token còn hạn
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: resetPasswordDto.token,
        resetPasswordExpires: { gt: new Date() }, // Điều kiện: Hạn phải lớn hơn thời gian hiện tại
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Token khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.',
      );
    }

    // Mã hóa mật khẩu mới và cập nhật DB, đồng thời xóa token
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      saltRounds,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return {
      message:
        'Cập nhật mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.',
    };
  }
}
