import { Inject, Injectable } from '@nestjs/common';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import type { IExtendedAuthRepository } from './auth.repository';
import { AuthCredentialDto } from './dto/authCredential.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ProviderTokens.AUTH_REPOSITORY)
    private authRepository: IExtendedAuthRepository,
  ) {}
  //   @ResponseMessage('User created successfully')
  async createUser(credentials: AuthCredentialDto) {
    const user = this.authRepository.create(credentials);
    await this.authRepository.save(user);

    return true;
  }
}
