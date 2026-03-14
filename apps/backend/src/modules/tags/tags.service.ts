import { PrismaService } from "@/common/prisma/prisma.service";
import { CreateTagDto } from "@/tags/dto/create-tag.dto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

/**
 * Service xử lý các logic nghiệp vụ cho Tag (nhãn/thẻ).
 * Chứa code thao tác trực tiếp với cơ sở dữ liệu qua Prisma.
 */
@Injectable()
export class TagsService {
    // Inject PrismaService để giao tiếp với DB
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Tạo một Tag mới.
     * Kỹ thuật: Kiểm tra tag trùng lặp dựa trên userId và tên tag trước khi tạo.
     */
    async create(userId: string, dto: CreateTagDto) {
        // Kiểm tra xem user này đã tạo tag với name này chưa. 
        // Thay vì findUnique bị xung đột kiểu dữ liệu index, sử dụng findFirst sẽ an toàn và dễ dùng hơn ở trường hợp này.
        const existing = await this.prisma.tag.findFirst({
            where: {
                userId,
                name: dto.name,
            },
        });

        // Ném lỗi 400 Bad Request nếu tag đã tồn tại với user này
        if (existing) {
            throw new BadRequestException("Tag already exists");
        }

        // Tạo tag mới trên Database
        const tag = await this.prisma.tag.create({
            data: {
                userId,
                name: dto.name,
            }
        });

        return {
            message: "Tag created successfully",
            tag,
        };
    }

    /**
     * Lấy toàn bộ danh sách Tag của một user.
     * Kỹ thuật: Sử dụng orderBy trong Prisma để sắp xếp danh sách theo Alphabet (A-Z).
     */
    async findAll(userId: string) {
        const tags = await this.prisma.tag.findMany({
            where: { userId },
            orderBy: {
                name: "asc" // asc = ascending (tăng dần 0-9, A-Z)
            }
        });

        return {
            message: "Tags fetched successfully",
            tags,
        };
    }

    /**
     * Xóa một Tag của user dựa vào ID.
     * Kỹ thuật: Phải xác minh đúng tag thuộc về yêu cầu (id) và đúng chủ sở hữu (userId) để tránh lỗ hổng IDOR (Insecure Direct Object Reference).
     */
    async remove(userId: string, id: string) {
        // BƯỚC 1: Kiểm tra xem tag có thuộc về user này hay không
        const existing = await this.prisma.tag.findFirst({
            where: {
                id,
                userId,
            },
        });

        // Nếu người dùng không sỡ hữu tag hoặc nó đã bị xoá, ném một lỗi 404
        if (!existing) {
            throw new NotFoundException("Tag not found");
        }

        // BƯỚC 2: Khi đã chắc chắn, tiến hành xóa theo Id
        await this.prisma.tag.delete({
            where: {
                id,
            },
        });

        return {
            message: "Tag deleted successfully",
        };
    }
}