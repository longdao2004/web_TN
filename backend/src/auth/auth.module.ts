import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule,
    // Đăng ký JwtModule để cấp phát Token
    JwtModule.register({
      // Secret key dùng để ký xác nhận Token (sẽ lấy từ file .env)
      secret: process.env.JWT_SECRET || 'khoa_luan_nong_san_secret_key', 
      signOptions: { expiresIn: '1d' }, // Token hết hạn sau 1 ngày
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, GoogleStrategy], // Nhúng PrismaService và các Strategy
})
export class AuthModule {}