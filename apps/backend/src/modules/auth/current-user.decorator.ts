import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Custom Decorator để lấy thông tin User hiện tại từ Request.
 * Trong .NET, việc này tương đương với việc truy cập (User.Identity) hoặc (HttpContext.Items["User"]).
 * Sau khi JwtStrategy.validate() thành công, Passport gán user vào request.user.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);