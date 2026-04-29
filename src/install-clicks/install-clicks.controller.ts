import { Controller, Get, Headers, Ip, Param, Redirect } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { InstallClicksService } from './install-clicks.service';

@Controller('i')
export class InstallClicksController {
  constructor(private readonly service: InstallClicksService) {}

  @Public()
  @Get(':token')
  @Redirect()
  async click(@Param('token') token: string, @Ip() ip: string, @Headers('user-agent') userAgent?: string) {
    const result = await this.service.processClick(token, ip, userAgent);
    return { url: result.redirectUrl, statusCode: 302 };
  }
}
