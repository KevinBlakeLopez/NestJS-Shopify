// my-redis-session-storage.module.ts
import { Module } from '@nestjs/common';
import { MyRedisSessionStorage } from './my-redis-session-storage';

@Module({
  providers: [MyRedisSessionStorage],
  exports: [MyRedisSessionStorage],
})
export class MyRedisSessionStorageModule {}
