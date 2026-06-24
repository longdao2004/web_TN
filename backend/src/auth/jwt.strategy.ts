import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Lấy Token từ Header của Request (chuẩn Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Bắt buộc kiểm tra hạn sử dụng của Token
      secretOrKey: process.env.JWT_SECRET || 'khoa_luan_nong_san_secret_key', // Phải khớp với chìa khóa lúc sinh Token
    });
  }

  // Hàm này tự động chạy nếu Token hợp lệ. 
  // Kết quả return ở đây sẽ được gắn vào biến `req.user` ở các API.
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}