import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { taskRepositoryProvider } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService, ...taskRepositoryProvider],
})
export class TasksModule {}
