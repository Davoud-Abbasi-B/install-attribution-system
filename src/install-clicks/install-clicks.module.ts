import { Module } from '@nestjs/common';
import { InstallClicksController } from './install-clicks.controller';
import { InstallClicksService } from './install-clicks.service';

@Module({ controllers: [InstallClicksController], providers: [InstallClicksService], exports: [InstallClicksService] })
export class InstallClicksModule {}
