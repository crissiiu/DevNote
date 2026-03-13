import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoteDto } from "@/notes/dto/create-note.dto";
import { QueryNotesDto } from "@/notes/dto/query-notes.dto";
import { UpdateNoteDto } from "@/notes/dto/update-note.dto";

/**
 * Service xử lý logic nghiệp vụ cho Ghi chú.
 * Tương đương với Service Layer trong kiến trúc 3 lớp của .NET.
 */
@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo ghi chú mới liên kết với User.
   */
  async create(userId: string, createNoteDto: CreateNoteDto) {
    const note = await this.prisma.note.create({
      data: {
        userId,
        title: createNoteDto.title,
        content: createNoteDto.content,
        isPinned: createNoteDto.isPinned ?? false,
        isArchived: createNoteDto.isArchived ?? false,
      },
    });

    return {
      message: "Note created successfully",
      note,
    };
  }

  /**
   * Lấy danh sách ghi chú với phân trang và tìm kiếm.
   * Tương tự việc dùng LINQ kết hợp với .Skip().Take() trong .NET.
   */
  async findAll(userId: string, query: QueryNotesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện lọc (Where clause)
    const where = {
      userId,
      ...(query.search
        ? {
            OR: [
              {
                title: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                content: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    // Chạy song song: Lấy data và Đếm tổng cộng (giống Task.WhenAll)
    const [notes, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [query.sortBy ?? "updatedAt"]: query.sortOrder ?? "desc",
        },
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      message: "Notes fetched successfully",
      data: notes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }

  /**
   * Tìm một ghi chú cụ thể. Luôn kiểm tra userId để đảm bảo bảo mật.
   */
  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
        userId, // Đảm bảo người dùng không xem được ghi chú của người khác
      },
    });

    if (!note) {
      throw new NotFoundException("Note not found");
    }

    return {
      message: "Note fetched successfully",
      note,
    };
  }

  /**
   * Cập nhật ghi chú.
   */
  async update(userId: string, id: string, updateNoteDto: UpdateNoteDto) {
    // 1. Kiểm tra ghi chú có tồn tại và thuộc về user không
    const existingNote = await this.prisma.note.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingNote) {
      throw new NotFoundException("Note not found");
    }

    // 2. Thực hiện cập nhật
    const note = await this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });

    return {
      message: "Note updated successfully",
      note,
    };
  }

  /**
   * Xóa ghi chú.
   */
  async remove(userId: string, id: string) {
    const existingNote = await this.prisma.note.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingNote) {
      throw new NotFoundException("Note not found");
    }

    await this.prisma.note.delete({
      where: { id },
    });

    return {
      message: "Note deleted successfully",
    };
  }
}
