import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import {v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const {status, search} = filterDto;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) ||    
                task.description.includes(search)    
            );
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        const data = this.tasks.find(task => task.id === id);

        if (!data){
            throw new NotFoundException(`Task with id:${id} not found`);
        }

        return data;
    }

    createTask(CreateTaskDto: CreateTaskDto):Task {
        const {title, description} = CreateTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string):void {
        const task = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== task.id);
    }
}
