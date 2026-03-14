import { 
    Catch, 
    ExceptionFilter,
    HttpException,
    ArgumentsHost,
    HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        
        const isHttpException = exception instanceof HttpException;

        const statusCode = isHttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = isHttpException
            ? exception.getResponse()
            : "Internal server error";

        let message: string | string[] = "Internal server error";

        if(typeof exceptionResponse === "string") {
            message = exceptionResponse
        }else if (
            typeof exceptionResponse === "object" &&
            exceptionResponse !== null &&
            "message" in exceptionResponse
        ) {
            message = (exceptionResponse as { message: string | string[] }).message;
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            timeStamp: new Date().toISOString(),
            path: request.url,
        });
    }
}