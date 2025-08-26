import { Provider } from '@nestjs/common';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import { DataSource, Repository } from 'typeorm';
import { Profile } from './profile.entity';

export interface IExtendedProfileRepository extends Repository<Profile> {}

export const ExtendedProfileRepository = async (dataSource: DataSource) =>
  dataSource.getRepository(Profile).extend({});

export const RepositoryProvider: Provider[] = [
  {
    provide: ProviderTokens.PROFILE_REPOSITORY,
    useFactory: ExtendedProfileRepository,
    inject: [ProviderTokens.DB_POSTGRES],
  },
];
