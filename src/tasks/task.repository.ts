import { Provider } from '@nestjs/common';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';

export interface IExtendedTaskRepositoryProvider extends Repository<Task> {}

const ExtendedTaskRepositoryProvider = async (
  dataSource: DataSource,
): Promise<IExtendedTaskRepositoryProvider> =>
  dataSource.getRepository(Task).extend({}) as IExtendedTaskRepositoryProvider;

export const taskRepositoryProvider: Provider[] = [
  {
    provide: ProviderTokens.TASK_REPOSITORY,
    useFactory: ExtendedTaskRepositoryProvider,
    inject: [ProviderTokens.DB_POSTGRES],
  },
];
