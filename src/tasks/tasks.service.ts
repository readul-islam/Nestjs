import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { ITask } from './task.model';

interface ExtendedTaskRepository extends Repository<Task> {
  findByStatus(status: string): Promise<Task[]>;
}

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASK_REPOSITORY') private taskRepository: ExtendedTaskRepository,
  ) {}

  async createTask(task: ITask): Promise<Task> {
    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTaskByStatus(status: string): Promise<Task[]> {
    return this.taskRepository.findByStatus(status);
  }
}
