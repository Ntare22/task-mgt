import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks/tasks.service';
import { TasksRepository } from './tasks/tasks.repository';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ntare',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
  providers: [TasksService],
})
export class AppModule {}
