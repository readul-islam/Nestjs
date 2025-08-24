import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { taskRepository } from './taskRepository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
// making own repository
export const taskProviders = [
  {
    provide: 'TASK_REPOSITORY',
    useFactory: taskRepository,
    inject: ['DATA_SOURCE'],
  },
];

@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService, ...taskProviders],
})
export class TasksModule {}
