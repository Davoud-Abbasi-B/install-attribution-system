import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/api-key.guard';
import { AttributionModule } from './attribution/attribution.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { InstallClicksModule } from './install-clicks/install-clicks.module';
import { InstallLinksModule } from './install-links/install-links.module';
import { InstallOpensModule } from './install-opens/install-opens.module';
import { InstallReportsModule } from './install-reports/install-reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    InstallLinksModule,
    InstallClicksModule,
    InstallOpensModule,
    AttributionModule,
    InstallReportsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
