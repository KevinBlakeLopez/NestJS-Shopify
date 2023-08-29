// my-redis-session-storage.ts
import { Injectable } from '@nestjs/common';
import { SessionStorage } from '@nestjs-shopify/core';
import { Session } from '@shopify/shopify-api';
import Redis from 'ioredis';

@Injectable()
export class MyRedisSessionStorage implements SessionStorage {
  private readonly redis = new Redis();

  async storeSession(session: Session): Promise<boolean> {
    console.log('Storing session', session);
    await this.redis.set(session.id, JSON.stringify(session));
    return true;
  }

  async loadSession(id: string): Promise<Session | undefined> {
    const session = await this.redis.get(id);
    return session ? JSON.parse(session) : undefined;
  }

  async deleteSession(id: string): Promise<boolean> {
    await this.redis.del(id);
    return true;
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    await this.redis.del(...ids);
    return true;
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    const keys = await this.redis.keys(`*:${shop}:*`);
    const sessions = await this.redis.mget(keys);
    return sessions.map((session) => JSON.parse(session));
  }
}
