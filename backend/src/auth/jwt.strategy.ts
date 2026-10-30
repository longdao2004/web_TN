import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      // Lấy Token từ Header của Request (chuẩn Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Bắt buộc kiểm tra hạn sử dụng của Token
      secretOrKey: process.env.JWT_SECRET || 'khoa_luan_nong_san_secret_key',
    });
  }

  // Tự động kiểm tra tính hợp lệ và đồng bộ vai trò mới nhất theo thời gian thực từ Database
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Nếu tài khoản không tồn tại hoặc đã bị Admin khóa (deletedAt khác null)
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa!');
    }

    // Luôn trả về role mới nhất từ Database
    return { userId: user.id, email: user.email, role: user.role };
  }
}