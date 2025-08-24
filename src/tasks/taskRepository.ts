import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';

export interface ExtendedTaskRepository extends Repository<Task> {
  findByStatus(status: string): Promise<Task[]>;
}

export const taskRepository = (
  dataSource: DataSource,
): ExtendedTaskRepository =>
  dataSource.getRepository(Task).extend({
    async findByStatus(
      this: Repository<Task>,
      status: string,
    ): Promise<Task[]> {
      return await this.find({
        where: { status },
      });
    },
  }) as ExtendedTaskRepository;
