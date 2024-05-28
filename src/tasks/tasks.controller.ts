import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
// import { Task } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  //   tasksService: TasksService;
  //   constructor(tasksService: TasksService) {
  //     this.tasksService = tasksService;
  //   }
  constructor(private readonly tasksService: TasksService) {}

  //   @Get('/all')
  //   getAllTasks(): Task[] {
  //     return this.tasksService.getAllTasks();
  //   }

  //   @Get()
  //   getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //     if (Object.keys(filterDto).length) {
  //       return this.tasksService.getTasksWithFilter(filterDto);
  //     } else {
  //       return this.tasksService.getAllTasks();
  //     }
  //   }

  //   @Get('/:id')
  //   getTaskById(@Param('id') id: string) {
  //     return this.tasksService.getTaskById(id);
  //   }

  //   @Post()
  //   createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //     return this.tasksService.createTask(createTaskDto);
  //   }

  //   @Patch('/:id/status')
  //   updateTaskStatusById(
  //     @Param('id') id: string,
  //     @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  //   ): Task {
  //     return this.tasksService.updateTaskStatusById(id, updateTaskStatusDto);
  //   }

  //   @Delete('/:id')
  //   deleteTaskById(@Param('id') id: string): void {
  //     return this.tasksService.deleteTaskById(id);
  //   }

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(
      id,
      updateTaskStatusDto,
      user,
    );
  }

  //   @Delete('/:id')
  //   deleteTaskById(
  //     @Param('id') id: string,
  //     @GetUser() user: User,
  //   ): Promise<void> {
  //     return this.tasksService.deleteTaskById(id, user);
  //   }
}
