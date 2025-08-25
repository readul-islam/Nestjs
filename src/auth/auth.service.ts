import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import { jwtConstants } from './auth.module';
import type { IExtendedAuthRepository } from './auth.repository';
import { AuthCredentialDto } from './dto/authCredential.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ProviderTokens.AUTH_REPOSITORY)
    private authRepository: IExtendedAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(credentials: AuthCredentialDto) {
    const { email } = credentials;
    if (await this.authRepository.isExistUser(email)) {
      throw new ConflictException('User already exists');
    }
    const user = this.authRepository.create(credentials);
    await this.authRepository.save(user);

    return true;
  }

  async signIn({ email, password }: AuthCredentialDto) {
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User didn't exist`);
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Password didn't match!`);
    }
    const accessToken = this.jwtService.sign(
      { sub: user.id, email },
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email },
      { expiresIn: '7d' },
    );

    await user.setCurrentRefreshToken(refreshToken);
    await this.authRepository.save(user);

    return { accessToken, refreshToken, userId: user.id };
  }

  async refresh(refreshToken: string) {
    const payload: any = this.jwtService.verify(refreshToken, {
      secret: jwtConstants.secret || 'access-secret',
    });
    const userId = payload.sub || '12';
    const user = await this.authRepository.findOne({
      where: { id: userId },
    });
    if (!user || !(await user.validateRefreshToken(refreshToken))) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '30m' },
    );
    const newRefreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    await user.setCurrentRefreshToken(newRefreshToken);
    await this.authRepository.save(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const payload: any = this.jwtService.verify(refreshToken, {
      secret: jwtConstants.secret || 'access-secret',
    });
    const user = await this.authRepository.findOne({
      where: { id: payload.sub },
    });
    if (user) {
      user.currentHashedRefreshToken = undefined;
      await this.authRepository.save(user);
    }
  }
}
