import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Data Transfer Object (DTO) cho việc tạo Ghi chú mới.
 * Tương đương với một ViewModel hoặc InputModel trong .NET.
 */
export class CreateNoteDto {
  @IsString({ message: "Title must be a string" })
  @MaxLength(200, { message: "The title must not exceed 200 characters." })
  title: string;

  @IsString({ message: "Content must be a string" })
  content: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}