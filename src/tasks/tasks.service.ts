import { Inject, Injectable } from '@nestjs/common';
import { ProviderTokens } from 'src/interfaces/ProviderTokens';
import type { IExtendedTaskRepositoryProvider } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @Inject(ProviderTokens.TASK_REPOSITORY)
    taskRepository: IExtendedTaskRepositoryProvider,
  ) {}
}
