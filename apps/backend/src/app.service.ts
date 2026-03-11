import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

/**
 * AppService - Tầng xử lý Logic nghiệp vụ (Business Logic Layer)
 * Chịu trách nhiệm tương tác với Database thông qua Prisma và tính toán dữ liệu.
 */
@Injectable()
export class AppService {
  /**
   * Inject PrismaService thông qua Dependency Injection. 
   * 'readonly' đảm bảo instance này không bị ghi đè sau khi khởi tạo.
   */
  constructor(private readonly prisma: PrismaService){}

  /**
   * Thực hiện truy vấn đếm số lượng bản ghi trong bảng User.
   * @returns {Promise<string>} Trả về chuỗi thông điệp kèm số lượng user thực tế.
   */
  public async getHello(): Promise<string> {
    // Truy vấn bất đồng bộ tới DB tầng Metadata của User Model
    const userCount: number = await this.prisma.user.count();
    
    // Sử dụng template strings để xây dựng Response Body
    return `Hello World! User count: ${userCount}`;
  }
}
