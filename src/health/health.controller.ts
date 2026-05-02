import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { DatabaseService } from '../database/database.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Service health check', description: 'Public endpoint (no API key required). Returns service status.' })
  @ApiOkResponse({ schema: { example: { success: true, service: 'install-attribution-system', status: 'ok' } } })
  getHealth() {
    return { success: true, service: 'install-attribution-system', status: 'ok' };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Database readiness check', description: 'Public endpoint (no API key required). Verifies database connectivity.' })
  @ApiOkResponse({ schema: { example: { success: true, database: 'ok' } } })
  async getReady() {
    await this.databaseService.checkReady();
    return { success: true, database: 'ok' };
  }
}
