import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth.module';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies['accessToken'];
    if (!token) throw new UnauthorizedException('No access token');

    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret || 'access-secret',
      });
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
