import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    getTask: jest.fn(),
});

const mockUser = {
    username: 'Jim',
    id: 's13424',
    password: 'pass',
    tasks: [],
};

describe('TaskService', () => {
    let tasksService: TasksService;
    let tasksRepository;

    beforeEach(async () => {
        // initialize a NestJs module with tasksService and tasksRepository
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TasksRepository, useFactory: mockTasksRepository }
            ],
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
    });

    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and returns the result', async () => {
            tasksRepository.getTasks.mockResolvedValue('someValue')
            const result = await tasksService.getTasks(null, mockUser);
            expect(result).toEqual('someValue')
        });
    });

    describe('getTaskById', () => {
        it('calls TasksRepository.findOne and returns the result', async () => {
            const mockTask = {
                title: 'Test title',
                description: 'Test desc',
                id: '1234',
                status: TaskStatus.OPEN
            };
            tasksRepository.getTask.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('1234', mockUser);
            expect(result).toEqual(mockTask);
        });

        it('calls TasksRepository.findOne and handles the error', async () => {
            tasksRepository.getTask.mockResolvedValue(null);
            expect(tasksService.getTaskById('12424', mockUser)).rejects.toThrow(NotFoundException);
        });
    });
})