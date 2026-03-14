import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
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
   * Gắn một Tag (Nhãn) vào một Note (Ghi chú).
   * Kỹ thuật:
   * 1. Kiểm tra quyền sở hữu (Note và Tag có thuộc về User này không).
   * 2. Kiểm tra xem NodeTag (quan hệ N-N) này đã tồn tại hay chưa để tránh lỗi vi phạm ràng buộc Unique.
   * LỖI ĐÃ SỬA: Bổ sung logic kiểm tra Tag có tồn tại không và vi phạm Unique constraint.
   */
  async addTagToNote(userId: string, noteId: string, tagId: string) {
    // Chạy song song 2 promises để kiểm tra quyền sở hữu của Note và Tag (Tối ưu hóa tốc độ)
    const [note, tag] = await Promise.all([
      this.prisma.note.findFirst({ where: { id: noteId, userId } }),
      this.prisma.tag.findFirst({ where: { id: tagId, userId } }),
    ]);

    // Báo lỗi 404 nếu không tìm thấy Note
    if (!note) {
      throw new NotFoundException("Note not found"); // Sửa lỗi đánh máy: "Note note found" -> "Note not found"
    }

    // Báo lỗi 404 nếu không tìm thấy Tag (ví dụ: gửi id bậy bạ của user khác)
    if (!tag) {
      throw new NotFoundException("Tag not found");
    }

    // Kiểm tra chống trùng lặp: Nếu Tag đã được liên kết với Note rồi thì không làm gì hoặc báo lỗi
    const existingRelation = await this.prisma.noteTag.findUnique({
      where: {
        noteId_tagId: {
          noteId,
          tagId,
        }
      }
    });

    if (existingRelation) {
      throw new BadRequestException("Tag is already added to this note");
    }

    // Tiến hành tạo bản ghi ở bảng trung gian (NoteTag)
    const relation = await this.prisma.noteTag.create({
      data: {
        noteId,
        tagId,
      },
    });

    return {
      message: "Tag added to note successfully",
      relation,
    }
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

    await this.prisma.noteRevision.create({
      data: {
        noteId: id,
        title: existingNote.title,
        content: existingNote.content,
      },
    });

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

  async findRevisions(userId: string, noteId: string) {
    const note =  await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId
      },
    });

    if(!note) {
      throw new NotFoundException("Note not found");
    }

    const revision = await this.prisma.noteRevision.findMany({
      where: {
        noteId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      mesage: "Revisions fetched successfully",
      data: revision,
    }
  }

  async findRevisionDetail(userId: string, noteId: string, revisionId: string){
    const note =  await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId
      },
    });

    if(!note) {
      throw new NotFoundException("Note not found");
    }

    const revision = await this.prisma.noteRevision.findFirst({
      where: {
        id: revisionId,
        noteId
      },
    });

    if(!revision) {
      throw new NotFoundException("Revision not found");
    }

    return {
      message: "Revision fetched successfully",
      revision,
    }
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

  async search(userId: string, q:string) {
    const keyword = q.trim();

    if(!keyword) {
      return {
        message: "Notes fetched successfully",
        data: []
      };
    }

    const notes = await this.prisma.$queryRaw<
      Array<{
        id: string;
        user_id: string;
        title: string;
        content: string;
        is_pinned: boolean;
        is_archived: boolean;
        created_at: Date;
        updated_at: Date;
        rank: number;
      }>
    >`
      SELECT
        n.id,
        n.user_id,
        n.title,
        n.content,
        n.is_pinned,
        n.is_archived,
        n.created_at,
        n.updated_at,
        ts_rank(
          to_tsvector('english', coalesce(n.title, '') || ' ' || coalesce(n.content, '')),
          plainto_tsquery('english', ${keyword})
        ) AS rank 
        FROM notes n
        WHERE 
          n.user_id = ${userId}
          AND n.is_archived = false
          AND to_tsvector('english', coalesce(n.title,'') || ' ' || coalesce(n.content,''))
            @@ plainto_tsquery('english', ${keyword})
        ORDER BY rank DESC, n.updated_at DESC
        LIMIT 20
    `;

    return {
      message: "Notes search completed successfully",
      data: notes.map((note) => ({
        id: note.id,
        userId: note.user_id,
        title: note.title,
        content: note.content,
        isPinned: note.is_pinned,
        isArchived: note.is_archived,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        rank: note.rank
      })),
    };
  }
}
