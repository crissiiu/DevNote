import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * DTO cho cập nhật Ghi chú.
 * Trong NestJS, khi dùng PATCH, các field thường là tùy chọn (Optional).
 */
export class UpdateNoteDto {
  @IsOptional()
  @IsString({ message: "Title must be a string" })
  @MaxLength(200, { message: "The title must not exceed 200 characters." })
  title?: string;

  @IsOptional()
  @IsString({ message: "Content must be a string" })
  content?: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}