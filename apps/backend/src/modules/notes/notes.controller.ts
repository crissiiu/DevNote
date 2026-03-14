import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { NotesService } from "@/notes/notes.service";
import { CurrentUser } from "@/auth/current-user.decorator";
import { CreateNoteDto } from "@/notes/dto/create-note.dto";
import { QueryNotesDto } from "@/notes/dto/query-notes.dto";
import { UpdateNoteDto } from "@/notes/dto/update-note.dto";
import { SearchNotesDto } from "@/notes/dto/search-notes.dto";

/**
 * Định nghĩa User type từ JWT payload để sử dụng trong controller.
 */
interface AuthenticatedUser {
  id: string;
  email: string;
}

/**
 * Controller quản lý các thao tác với Ghi chú.
 * Tất cả các API trong này đều được bảo vệ bởi JwtAuthGuard (yêu cầu Login).
 */
@UseGuards(JwtAuthGuard)
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * Tạo ghi chú mới.
   * [HttpPost]
   */
  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.notesService.create(user.id, createNoteDto);
  }
  
  /**
   * Lấy danh sách ghi chú (có phân trang/tìm kiếm).
   * [HttpGet]
   */
  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryNotesDto,
  ) {
    return this.notesService.findAll(user.id, query);
  }

  /**
   * Tìm kiếm ghi chú theo từ khóa.
   * [HttpGet("search")]
   */
  @Get("search")
  async search(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: SearchNotesDto,
  ) {
    return this.notesService.search(user.id, query.q);
  }

  /**
   * Lấy chi tiết một ghi chú.
   * [HttpGet("{id}")]
   */
  @Get(":id")
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.notesService.findOne(user.id, id);
  }

  /**
   * Cập nhật ghi chú.
   * [HttpPatch("{id}")]
   */
  @Patch(":id")
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(user.id, id, updateNoteDto);
  }

  /**
   * Xóa ghi chú.
   * [HttpDelete("{id}")]
   */
  @Delete(":id")
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.notesService.remove(user.id, id);
  }
}