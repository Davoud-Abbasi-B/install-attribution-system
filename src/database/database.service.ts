import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(configService: ConfigService) {
    this.pool = new Pool({
      host: configService.get('DATABASE_HOST', 'localhost'),
      port: Number(configService.get('DATABASE_PORT', 5434)),
      user: configService.get('DATABASE_USER', 'install_tracking'),
      password: configService.get('DATABASE_PASSWORD', 'install_tracking'),
      database: configService.get('DATABASE_NAME', 'install_tracking'),
      max: Number(configService.get('DATABASE_POOL_MAX', 20)),
      idleTimeoutMillis: Number(configService.get('DATABASE_IDLE_TIMEOUT_MS', 30000)),
      connectionTimeoutMillis: Number(configService.get('DATABASE_CONNECTION_TIMEOUT_MS', 2000)),
    });
  }

  query(text: string, values?: unknown[]) {
    return this.pool.query(text, values);
  }

  async checkReady(): Promise<boolean> {
    await this.query('SELECT 1');
    return true;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
