import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


type ResponseData<T> = {
    message?: string;
    data?: T;
    [key: string]: unknown;
}

@Injectable()
export class TransformResponseInterceptor<T> 
implements NestInterceptor<T, unknown>
{
    intercept(
        _context: ExecutionContext,
        next: CallHandler
    ): Observable<unknown> {
        return next.handle().pipe(
            map((response: ResponseData<T> | T) =>{
                if(
                    typeof response === "object" &&
                    response !== null &&
                    "message" in response
                ) {
                    const {message, ...rest} = response;
                    return {
                        success: true,
                        message: message ?? "Request successful",
                        ...rest,
                    };
                }

                return {
                    success: true,
                    data: response,
                };
            }),
        );
    }
}