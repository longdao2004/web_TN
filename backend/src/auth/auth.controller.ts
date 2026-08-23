import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // --- GOOGLE AUTH ROUTES ---
  // API: Chuyển hướng người dùng tới trang đăng nhập Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport tự động xử lý chuyển hướng tới accounts.google.com
  }

  // API: Google sẽ gọi callback này sau khi người dùng đăng nhập thành công
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    // Gọi service xử lý login/register
    const result = await this.authService.googleLogin(req.user);
    // Redirect thẳng về Frontend kèm token trên URL
    return res.redirect(`http://localhost:3001/dang-nhap-google/callback?token=${result.accessToken}`);
  }

  // --- FORGOT PASSWORD ROUTES ---
  // API: Quên mật khẩu (Nhập email để nhận link khôi phục)
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // API: Đặt lại mật khẩu (Nhập token lấy từ email và mật khẩu mới)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
