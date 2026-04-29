import { Controller, Get } from '@nestjs/common';
import { InstallReportsService } from './install-reports.service';

@Controller('install-reports')
export class InstallReportsController {
  constructor(private readonly service: InstallReportsService) {}

  @Get('summary')
  summary() { return this.service.summary(); }
}
