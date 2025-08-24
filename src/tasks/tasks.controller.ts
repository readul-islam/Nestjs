import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTask() {
    return this.tasksService.findAll();
  }

  @Post()
  createTask(@Body() task: any) {
    return this.tasksService.createTask(task);
  }

  @Get('/status')
  getTaskByStatus(@Query('status') status: string) {
    return this.tasksService.getTaskByStatus(status);
  }
}
