import { Module } from '@nestjs/common';
import { AttributionModule } from '../attribution/attribution.module';
import { InstallOpensController } from './install-opens.controller';
import { InstallOpensService } from './install-opens.service';

@Module({ imports: [AttributionModule], controllers: [InstallOpensController], providers: [InstallOpensService] })
export class InstallOpensModule {}
