import { IsNotEmpty, IsString, MaxLength } from "class-validator";

/**
 * Data Transfer Object (DTO) cho việc tạo Tag.
 * Sử dụng class-validator để tự động validate dữ liệu đầu vào.
 */
export class CreateTagDto {
    @IsString({ message: "The tag name must be a string." })
    @IsNotEmpty({ message: "The tag name cannot be left blank." })
    @MaxLength(50, { message: "The tag name cannot exceed 50 characters." })
    name!: string;
}