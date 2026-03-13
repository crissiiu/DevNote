import { Module } from "@nestjs/common";
import { NotesController } from "@/notes/notes.controller";
import { NotesService } from "@/notes/notes.service";

/**
 * Module quản lý tính năng Ghi chú.
 * Tương tự như việc gộp các Controller và Service liên quan vào một cụm trong Dependency Injection.
 */
@Module({
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}