import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

/**
 * PrismaService: Lớp trung gian quản lý kết nối Database thông qua Prisma Client.
 * Kế thừa PrismaClient để có quyền truy cập trực tiếp vào các phương thức CRUD của Prisma.
 */
@Injectable()
export class PrismaService 
  extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy 
{
    constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString || typeof connectionString !== "string") {
      throw new Error("DATABASE_URL is missing or invalid");
    }

    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  /**
   * Hook Lifecycle: Được kích hoạt khi module khởi tạo.
   * Thiết lập Connection Pool tới Database ngay khi ứng dụng Startup.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Hook Lifecycle: Được kích hoạt khi ứng dụng nhận tín hiệu Shutdown.
   * Thực hiện Graceful Shutdown để đóng kết nối và giải phóng tài nguyên.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}