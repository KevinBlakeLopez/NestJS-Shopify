import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AccessMode,
  CurrentSession,
  UseShopifyAuth,
  ShopifyAuthGuard,
} from '@nestjs-shopify/auth';
import { Session } from '@shopify/shopify-api';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseShopifyAuth(AccessMode.Online)
  @UseGuards(ShopifyAuthGuard)
  async index(@CurrentSession() session: Session) {
    console.log(session);
    return this.appService.getHello();
  }
}
