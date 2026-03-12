import { PrismaService } from "@/common/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "@/auth/dto/register.dto";
import { LoginDto } from "@/auth/dto/login.dto";

@Injectable()
export class AuthService{
    constructor(
        private readonly prisma: PrismaService,
    ){}

    async register(registerDto:RegisterDto){
        const {email,password,displayName} = registerDto;

        const existUser = await this.prisma.user.findUnique({
            where:{email}
        })

        if(existUser){
            throw new BadRequestException("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data:{
                email,
                passwordHash:hashedPassword,
                displayName:displayName || email,
            },
            select: {
                id: true,
                email: true,
                displayName: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            message: "Register Successful",
            user,
        }
    }

    async login(loginDto:LoginDto){
        const {email, password} = loginDto;

        const user = await this.prisma.user.findUnique({
            where:{email}
        });

        if(!user){
            throw new UnauthorizedException("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        
        if(!isPasswordValid){
            throw new UnauthorizedException("Invalid email or password");
        }

        return {
            message:"Login successful",
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
            }
        }
    }
}