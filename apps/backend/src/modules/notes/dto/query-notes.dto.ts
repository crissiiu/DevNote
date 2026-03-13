import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

/**
 * DTO xử lý việc tìm kiếm, phân trang và sắp xếp.
 * Tương đương với các Query Parameters trong .NET Web API.
 */
export class QueryNotesDto {
  @IsOptional()
  @IsString({ message: "Search must be a string" })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value)) // Chuyển string từ URL sang number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsIn(["updatedAt", "createdAt", "title"])
  sortBy?: "updatedAt" | "createdAt" | "title" = "updatedAt";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}