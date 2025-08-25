import { Provider } from '@nestjs/common';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import { DataSource, Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { IAuth } from './interfaces/auth.interface';

export interface IExtendedAuthRepository extends Repository<Auth> {
  isExistUser(email: string): Promise<IAuth>;
}

export const ExtendedAuthRepository = (
  dataSource: DataSource,
): IExtendedAuthRepository =>
  dataSource.getRepository(Auth).extend({
    async isExistUser(
      this: Repository<Auth>,
      email: string,
    ): Promise<IAuth | null> {
      return await this.findOne({
        where: {
          email,
        },
      });
    },
  }) as IExtendedAuthRepository;

export const AuthRepositoryProvider: Provider[] = [
  {
    provide: ProviderTokens.AUTH_REPOSITORY,
    useFactory: ExtendedAuthRepository,
    inject: [ProviderTokens.DB_POSTGRES],
  },
];
