import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "@/auth/dto/register.dto";
import { LoginDto } from "@/auth/dto/login.dto";
import { CurrentUser } from "./current-user.decorator";
import { JwtAuthGuard } from "./jwt-auth.guard";

/**
 * Controller trong NestJS tương đương với ControllerBase/Controller trong .NET WebAPI.
 * @Controller("auth") xác định base route là /auth.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint đăng ký.
   * [HttpPost("register")] trong .NET.
   */
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Endpoint đăng nhập.
   * Logic xử lý đã được đóng gói trong Service.
   */
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint lấy thông tin cá nhân.
   * [Authorize] trong .NET tương đương với @UseGuards(JwtAuthGuard).
   * Custom Decorator @CurrentUser tương đương với việc parse User từ HttpContext.
   */
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@CurrentUser() user: any) {
    return {
      message: "Profile fetched successfully",
      user,
    };
  }
}