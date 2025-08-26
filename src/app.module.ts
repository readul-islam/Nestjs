import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TransformInterceptorProvider } from './common/interceptors/transform.interceptor';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './profile/profile.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [DatabaseModule, AuthModule, ProfileModule, TasksModule],
  controllers: [],
  providers: [TransformInterceptorProvider],
})
export class AppModule {}
