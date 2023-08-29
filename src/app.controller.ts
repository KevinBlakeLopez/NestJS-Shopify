import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AccessMode,
  CurrentSession,
  UseShopifyAuth,
} from '@nestjs-shopify/auth';
import { Session } from '@shopify/shopify-api';

@UseShopifyAuth(AccessMode.Online)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(@CurrentSession() session: Session) {
    console.log(session.shop);
    return this.appService.getHello();
  }
}
