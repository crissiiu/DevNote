import { IsOptional, IsString, MaxLength } from "class-validator";


export class SearchNotesDto {
    @IsString()
    @MaxLength(200)
    q!:string;

    @IsOptional()
    @IsString()
    language?: string = "english";
}