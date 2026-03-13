import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "@/auth/types/jwt-payload.type";

/**
 * Strategy là nơi định nghĩa cách thức xác thực JWT.
 * Tương đương với việc cấu hình JwtBearer authentication trong Startup.cs/Program.cs của .NET.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    super({
      // Lấy token từ header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Sau khi token đã được giải mã thành công (valid), hàm validate() sẽ được gọi.
   * Kết quả trả về từ hàm này (user) sẽ được gán vào request.user.
   */
  async validate(payload: JwtPayload) {
    // Tìm user trong database dựa trên 'sub' (ID) lưu trong token
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found or account deactivated");
    }

    // Đối tượng này sẽ khả dụng qua @CurrentUser() decorator
    return user;
  }
}