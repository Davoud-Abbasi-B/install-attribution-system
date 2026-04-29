import { Body, Controller, Post } from '@nestjs/common';
import { CreateInstallLinkDto } from './dto/create-install-link.dto';
import { InstallLinksService } from './install-links.service';

@Controller('install-links')
export class InstallLinksController {
  constructor(private readonly service: InstallLinksService) {}

  @Post()
  create(@Body() dto: CreateInstallLinkDto) {
    return this.service.create(dto);
  }
}
