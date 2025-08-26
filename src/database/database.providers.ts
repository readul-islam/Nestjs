import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: ProviderTokens.DB_POSTGRES,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'user',
        password: 'password',
        database: 'nestjs-task-management',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return await dataSource.initialize();
    },
  },
];
