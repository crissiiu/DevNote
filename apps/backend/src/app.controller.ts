import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';

/**
 * AppController - Tầng điều hướng (Presentation Layer)
 * Xử lý các HTTP Request đầu vào và trả về HTTP Response tương ứng.
 */
@Controller()
export class AppController {
  /**
   * Khởi tạo Controller với AppService. 
   * Việc tách biệt Controller và Service giúp tuân thủ nguyên tắc Single Responsibility (SRP).
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint: GET /
   * Xử lý yêu cầu truy xuất thông tin cơ bản của hệ thống.
   * @returns {Promise<string>} Kết quả xử lý từ Service layer.
   */
  @Get()
  public async getHello(): Promise<string> {
    // Ủy quyền (Delegation) việc xử lý logic cho AppService.
    return await this.appService.getHello();
  }
}
