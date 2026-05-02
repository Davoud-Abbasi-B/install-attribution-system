import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateInstallLinkDto } from './dto/create-install-link.dto';
import { InstallLinksService } from './install-links.service';

@ApiTags('install-links')
@Controller('install-links')
export class InstallLinksController {
  constructor(private readonly service: InstallLinksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create install attribution link',
    description: 'Protected endpoint (requires x-api-key: dev-install-api-key). Creates a short install attribution link for a campaign. Use install_url in ads, SMS, banners, landing pages, or ad networks.',
  })
  @ApiBody({ type: CreateInstallLinkDto })
  @ApiCreatedResponse({
    description: 'Install link created successfully.',
    schema: {
      example: {
        success: true,
        install_link: {
          token: 'gzb1405',
          install_url: 'http://192.168.3.64:3001/i/gzb1405',
          product_name: 'ghabzino',
          package_name: 'com.ayanco.ghabzino',
          campaign_name: 'car_transfer_launch',
          media_source: 'tapsell',
          channel: 'paid',
          destination_store: 'cafebazaar',
          destination_url: 'https://cafebazaar.ir/app/com.ayanco.ghabzino',
        },
      },
    },
  })
  @ApiBadRequestResponse({ schema: { example: { success: false, error_code: 'BAD_REQUEST', message: 'destination_url is required' } } })
  @ApiUnauthorizedResponse({ schema: { example: { success: false, error_code: 'UNAUTHORIZED', message: 'x-api-key is required' } } })
  create(@Body() dto: CreateInstallLinkDto) {
    return this.service.create(dto);
  }
}
