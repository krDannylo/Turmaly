import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/module/auth/common/auth.constants';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_TOKEN_PAYLOAD_NAME];

    if (!user) return false;

    const profile = await this.userService.getUserProfile(user.sub);
    if (!profile) throw new NotFoundException('Perfil não encontrado');

    request.profile = profile;
    return true;
  }
}