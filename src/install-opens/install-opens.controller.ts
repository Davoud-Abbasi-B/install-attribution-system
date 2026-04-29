import { Body, Controller, Post } from '@nestjs/common';
import { CreateInstallOpenDto } from './dto/create-install-open.dto';
import { InstallOpensService } from './install-opens.service';

@Controller('install-opens')
export class InstallOpensController {
  constructor(private readonly service: InstallOpensService) {}
  @Post()
  create(@Body() dto: CreateInstallOpenDto) { return this.service.create(dto); }
}
