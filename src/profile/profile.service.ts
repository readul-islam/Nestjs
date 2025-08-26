import { Inject, Injectable } from '@nestjs/common';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import type { IExtendedProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(ProviderTokens.PROFILE_REPOSITORY)
    private profileRepository: IExtendedProfileRepository,
  ) {}
}
