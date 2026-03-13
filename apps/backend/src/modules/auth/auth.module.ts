import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "@/common/prisma/prisma.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";

/**
 * Module là nơi quản lý Dependency Injection và cấu hình cho một cụm tính năng.
 * Tương đương với Startup.cs hoặc Program.cs trong .NET khi bạn cấu hình services.AddXxx().
 */
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}

@Module({
  imports: [
    PrismaModule,
    // PassportModule giúp tích hợp các chiến lược xác thực (như JWT)
    PassportModule,
    // Cấu hình JWT: Secret key và thời gian hết hạn
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        // Cần ép kiểu 'as any' do sự khác biệt giữa generic string và StringValue type của thư viện
        expiresIn: (process.env.JWT_EXPIRES || "7d") as any,
      },
    }),
  ],
  controllers: [AuthController],
  // Providers chứa các class sẽ được NestJS quản lý vòng đời và inject khi cần
  providers: [AuthService, JwtStrategy],
  // Exports cho phép các Module khác sử dụng AuthService khi import AuthModule
  exports: [AuthService],
})
export class AuthModule {}