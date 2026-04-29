import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { DatabaseService } from '../database/database.service';

@Controller()
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Public()
  @Get('health')
  getHealth() {
    return { success: true, service: 'install-attribution-system', status: 'ok' };
  }

  @Public()
  @Get('ready')
  async getReady() {
    await this.databaseService.checkReady();
    return { success: true, database: 'ok' };
  }
}
