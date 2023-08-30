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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
          hostName: 'http://localhost:4444',
          scopes: ['read_products', 'write_products'],
          sessionStorage,
          isEmbeddedApp: true,
          debug: true,
        };
      },
      inject: [ConfigService],
    }),
    ShopifyAuthModule.forRootAsyncOnline({
      imports: [MyRedisSessionStorageModule],
      useFactory: async (
        configService: ConfigService,
        sessionStorage: MyRedisSessionStorage,
      ) => {
        return {
          apiKey: configService.get('SHOPIFY_API_KEY'),
          apiSecretKey: configService.get('SHOPIFY_API_SECRET'),
          basePath: 'user',
          debug: true,
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
