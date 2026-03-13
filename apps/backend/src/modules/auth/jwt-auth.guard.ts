import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard này dùng để bảo vệ các routes yêu cầu đăng nhập.
 * Tương đương với attribute [Authorize] trong .NET.
 * "jwt" ở đây ánh xạ trực tiếp đến PassportStrategy(Strategy) trong JwtStrategy.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}