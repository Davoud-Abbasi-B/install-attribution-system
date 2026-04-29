import { Module } from '@nestjs/common';
import { InstallLinksController } from './install-links.controller';
import { InstallLinksService } from './install-links.service';

@Module({ controllers: [InstallLinksController], providers: [InstallLinksService], exports: [InstallLinksService] })
export class InstallLinksModule {}
