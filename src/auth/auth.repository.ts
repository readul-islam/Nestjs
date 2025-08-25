import { Provider } from '@nestjs/common';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import { DataSource, Repository } from 'typeorm';
import { Auth } from './auth.entity';

export interface IExtendedAuthRepository extends Repository<Auth> {}

export const ExtendedAuthRepository = (
  dataSource: DataSource,
): IExtendedAuthRepository =>
  dataSource.getRepository(Auth).extend({}) as IExtendedAuthRepository;

export const AuthRepositoryProvider: Provider[] = [
  {
    provide: ProviderTokens.AUTH_REPOSITORY,
    useFactory: ExtendedAuthRepository,
    inject: [ProviderTokens.DB_POSTGRES],
  },
];
