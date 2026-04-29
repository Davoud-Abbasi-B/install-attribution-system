import { Module } from '@nestjs/common';
import { InstallReportsController } from './install-reports.controller';
import { InstallReportsService } from './install-reports.service';

@Module({ controllers: [InstallReportsController], providers: [InstallReportsService] })
export class InstallReportsModule {}
