import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopifyCoreModule } from '@nestjs-shopify/core';
import '@shopify/shopify-api/adapters/node';
import { ApiVersion } from '@shopify/shopify-api';
import { MyRedisSessionStorageModule } from './my-redis-session-storage.module';
import { MyRedisSessionStorage } from './my-redis-session-storage';
import { ShopifyAuthModule } from '@nestjs-shopify/auth';

@Module({
  imports: [
    ShopifyAuthModule.forRootAsyncOnline({
      useFactory: () => ({
        basePath: 'user',
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MyRedisSessionStorageModule,
    ShopifyCoreModule.forRootAsync({
      imports: [MyRedisSessionStorageModule],
      useFactory: async (
        configService: ConfigService,
        sessionStorage: MyRedisSessionStorage,
      ) => {
        return {
          apiKey: configService.get('SHOPIFY_API_KEY'),
          apiSecretKey: configService.get('SHOPIFY_API_SECRET'),
          apiVersion: ApiVersion.Unstable,
          hostName: configService.get('HOST').replace(/https:\/\//, ''),
          isEmbeddedApp: true,
          scopes: ['test_scope'],
          sessionStorage,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
