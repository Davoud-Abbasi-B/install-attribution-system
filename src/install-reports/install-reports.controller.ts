import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InstallReportsService } from './install-reports.service';

@ApiTags('install-reports')
@Controller('install-reports')
export class InstallReportsController {
  constructor(private readonly service: InstallReportsService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get install attribution summary',
    description: 'Protected endpoint (requires x-api-key: dev-install-api-key). Returns clicks, install_opens, attributed installs, organic installs, invalid click installs, duplicate opens, and click-to-install rate.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        summary: {
          clicks: 1000,
          install_opens: 250,
          attributed_installs: 220,
          organic_installs: 30,
          invalid_click_installs: 0,
          duplicate_opens: 10,
          click_to_install_rate: 22,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ schema: { example: { success: false, error_code: 'UNAUTHORIZED', message: 'invalid API key' } } })
  summary() { return this.service.summary(); }
}
