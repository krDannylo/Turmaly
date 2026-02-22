import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserProfile = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.profile; // profile deve ser preenchido por um Guard
  },
);