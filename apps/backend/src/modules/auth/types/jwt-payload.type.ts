/**
 * @description Định nghĩa cấu trúc dữ liệu bên trong JWT Token.
 * Trong .NET, cái này tương đương với nội dung của ClaimsIdentity.
 */
export type JwtPayload = {
  /** 'sub' đại diện cho 'Subject', thường là ID của User (ID duy nhất) */
  sub: string;
  /** Email của user để có thể nhận diện nhanh mà không cần query DB */
  email: string;
};