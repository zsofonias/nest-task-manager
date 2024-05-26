import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  //   private tasks: Task[] = [];
  //   getAllTasks(): Task[] {
  //     return this.tasks;
  //   }
  //   getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //     const { status, search } = filterDto;
  //     let tasks = this.getAllTasks();
  //     if (status) {
  //       tasks = tasks.filter((task) => task.status === status);
  //     }
  //     if (search) {
  //       tasks = tasks.filter((task) => {
  //         if (task.title.includes(search) || task.description.includes(search)) {
  //           return true;
  //         }
  //         return false;
  //       });
  //     }
  //     return tasks;
  //   }
  //   getTaskById(id: string): Task {
  //     const task = this.tasks.find((task) => task.id === id);
  //     if (!task) {
  //       throw new NotFoundException();
  //     }
  //     return task;
  //   }
  //   createTask(createTaskDto: CreateTaskDto): Task {
  //     const { title, description } = createTaskDto;
  //     const task: Task = {
  //       id: uuidV4(),
  //       title,
  //       description,
  //       status: TaskStatus.OPEN,
  //     };
  //     this.tasks.push(task);
  //     return task;
  //   }
  //   updateTaskStatusById(
  //     id: string,
  //     updateTaskStatusDto: UpdateTaskStatusDto,
  //   ): Task {
  //     const { status } = updateTaskStatusDto;
  //     const task = this.getTaskById(id);
  //     task.status = status;
  //     return task;
  //   }
  //   deleteTaskById(id: string) {
  //     const taskIndex = this.tasks.findIndex((task) => task.id === id);
  //     if (taskIndex < 0) {
  //       throw new NotFoundException();
  //     }
  //     taskIndex >= 0 && this.tasks.splice(taskIndex, 1);
  //   }

  //   Using TYPEORM
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTaskStatusById(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    const task = await this.getTaskById(id);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
