import { PrismaService } from "@/common/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "@/auth/dto/register.dto";
import { LoginDto } from "@/auth/dto/login.dto";
import { JwtService } from "@nestjs/jwt";

/**
 * @Service trong NestJS tương đương với các Service Class trong .NET Core.
 * Nó được đánh dấu bằng @Injectable() để NestJS có thể thực hiện Dependency Injection.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng ký người dùng mới.
   * Logic: Kiểm tra email -> Hash password -> Lưu DB.
   */
  async register(registerDto: RegisterDto) {
    const { email, password, displayName } = registerDto;

    // Tương tự query FirstOrDefault() trong LINQ
    const existUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      // Ném ra Exception cụ thể, NestJS sẽ tự động chuyển thành HTTP 400
      throw new BadRequestException("Email already exists");
    }

    // Hash mật khẩu (10 rounds) trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        displayName: displayName || email,
      },
      // Chỉ chọn các field cần thiết để trả về (tương tự .Select() trong LINQ)
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: "Register Successful",
      user,
    };
  }

  /**
   * Đăng nhập người dùng.
   * Logic: Tìm user -> Kiểm tra pass -> Ký JWT token.
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // So sánh password plain-text với hash trong database
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // QUAN TRỌNG: signAsync là hàm bất đồng bộ, CẦN 'await'
    // Trong .NET là await _jwtService.CreateTokenAsync(...)
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    };
  }
}