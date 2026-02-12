import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "src/module/auth/common/auth.constants";

export const GetStudentId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[REQUEST_TOKEN_PAYLOAD_NAME]?.sub
})