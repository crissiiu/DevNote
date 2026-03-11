import { Global, Module } from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";

/**
 * PrismaModule: Module chịu trách nhiệm quản lý và phân phối PrismaService.
 * 
 * @Global(): Đánh dấu đây là Global Module. 
 * Giúp cho PrismaService có thể được sử dụng ở bất kỳ đâu trong ứng dụng
 * mà không cần phải import PrismaModule lại ở nhiều nơi.
 */
@Global()
@Module({
    // Khai báo PrismaService là một Provider để NestJS quản lý (Dependency Injection).
    providers: [PrismaService],
    // Export PrismaService để các module khác có thể truy cập và sử dụng instance này.
    exports: [PrismaService],
})
export class PrismaModule {}