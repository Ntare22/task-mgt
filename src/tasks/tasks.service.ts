import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return found;
  }

  deleteTaskById(id: string): void {
    // const arrLen = this.tasks.length;

    // for (let i = 0; i < arrLen; i++) {
    //   if (this.tasks[i].id === id) {
    //     this.tasks.splice(i, 1);
    //   }
    // }
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  // updateTaskStatus(id: string): Task {
  //   for (let i = 0; i < this.tasks.length; i++) {
  //     if (this.tasks[i].id === id && this.tasks[i].status === TaskStatus.OPEN) {
  //       this.tasks[i].status = TaskStatus.IN_PROGRESS;
  //     } else {
  //       this.tasks[i].status = TaskStatus.DONE;
  //     }
  //     return this.tasks[i];
  //   }
  // }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
