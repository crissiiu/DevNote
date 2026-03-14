import { Controller, Delete, Get, Param, Post, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { TagsService } from "@/tags/tags.service";
import { CreateTagDto } from "@/tags/dto/create-tag.dto";
import { CurrentUser } from "@/auth/current-user.decorator";

// Type định nghĩa sơ bộ cho User lấy ra từ token xác thực
type User = {
    id: string,
}

/**
 * Controller xử lý các request HTTP (GET, POST, DELETE...) liên quan đến danh mục Tag.
 * Kỹ thuật @UseGuards(JwtAuthGuard): Bảo vệ toàn bộ class Controller này. Yêu cầu mọi request gửi đến phải có Bearer Token JWT hợp lệ.
 */
@UseGuards(JwtAuthGuard)
@Controller('tags') // Base endpoint cho controller này sẽ là `/tags`
export class TagsController {
    // Inject Service vào Controller thông qua Dependency Injection.
    constructor(private readonly tagsService: TagsService) {}

    /**
     * Endpoint API: POST /tags
     * Nhiệm vụ: Tạo một Tag mới
     * Kỹ thuật @CurrentUser(): Custom decorator để trích xuất thông tin user đang đăng nhập từ phần req.user.
     */
    @Post()
    async create(@CurrentUser() user: User, @Body() dto: CreateTagDto) {
        return this.tagsService.create(user.id, dto);
    }

    /**
     * Endpoint API: GET /tags
     * Nhiệm vụ: Lấy danh sách toàn bộ Tag của người dùng
     */
    @Get()
    async findAll(@CurrentUser() user: User) {
        return this.tagsService.findAll(user.id);
    }

    /**
     * Endpoint API: DELETE /tags/:id
     * Nhiệm vụ: Xóa một Tag được chỉ định theo tham số ID trên thanh URL.
     * Kỹ thuật @Param('id'): Lấy giá trị chuỗi ở vị trí `:id` trên endpoint URL (/tags/123 -> id = "123").
     */
    @Delete(':id')
    async remove(@CurrentUser() user: User, @Param('id') id: string) {
        return this.tagsService.remove(user.id, id);
    }
}