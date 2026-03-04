import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";
import { InvalidTokenException, TokenNotFoundException } from "../exceptions/auth.exception";

export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new TokenNotFoundException()
    }

    try {
      const { secret, audience, issuer } = this.jwtConfiguration;
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
        audience,
        issuer
      })

      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;

      return true;
    }
    catch (e) {
      throw new InvalidTokenException()
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers['authorization'];
    if (!authorization) {
      return undefined;
    }
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}