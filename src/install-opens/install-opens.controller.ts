import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateInstallOpenDto } from './dto/create-install-open.dto';
import { InstallOpensService } from './install-opens.service';

@ApiTags('install-opens')
@Controller('install-opens')
export class InstallOpensController {
  constructor(private readonly service: InstallOpensService) {}

  @Post()
  @ApiOperation({
    summary: 'Receive app first open / install open',
    description: 'Protected endpoint (requires x-api-key: dev-install-api-key). Receives first open from mobile app after installation. Attribution statuses: attributed, organic, invalid_click, duplicate.',
  })
  @ApiBody({
    type: CreateInstallOpenDto,
    examples: {
      attributed_install: { value: { Identity: { Token: 'E61165CBE2B74373B90EBA23C6805412' }, Parameters: { product_name: 'ghabzino', package_name: 'com.ayanco.ghabzino', device_id: 'device_123', store: 'cafebazaar', install_click_id: '2a4162fa-264e-4db5-93dd-9d9b87cefc78', token: 'gzb1405', referrer_raw: 'ayanco_token=gzb1405&ayanco_install_click_id=2a4162fa-264e-4db5-93dd-9d9b87cefc78&utm_source=tapsell&utm_campaign=car_transfer_launch', app_version: '5.2.0', os_version: 'Android 14' } } },
      organic_install: { value: { Identity: { Token: 'E61165CBE2B74373B90EBA23C6805412' }, Parameters: { product_name: 'ghabzino', package_name: 'com.ayanco.ghabzino', device_id: 'device_organic_001', store: 'cafebazaar', install_click_id: null, token: null, referrer_raw: null, app_version: '5.2.0', os_version: 'Android 14' } } },
      invalid_click_install: { value: { Identity: { Token: 'E61165CBE2B74373B90EBA23C6805412' }, Parameters: { product_name: 'ghabzino', package_name: 'com.ayanco.ghabzino', device_id: 'device_invalid_001', store: 'cafebazaar', install_click_id: '00000000-0000-0000-0000-000000000000', token: 'gzb1405', referrer_raw: 'ayanco_token=gzb1405&ayanco_install_click_id=00000000-0000-0000-0000-000000000000', app_version: '5.2.0', os_version: 'Android 14' } } },
    },
  })
  @ApiOkResponse({
    description: 'Install open accepted.',
    schema: {
      examples: {
        attributed: { value: { Status: { Code: 200, Description: 'Install open accepted successfully.' }, Parameters: { success: true, install_open_id: '6d42d537-8f25-4e8c-bd1c-b7f16b99481e', attribution_status: 'attributed', attributed_install_click_id: '2a4162fa-264e-4db5-93dd-9d9b87cefc78', opened_at: '2026-04-29T10:30:00.000Z' } } },
        organic: { value: { Status: { Code: 200, Description: 'Install open accepted as organic.' }, Parameters: { success: true, install_open_id: '6d42d537-8f25-4e8c-bd1c-b7f16b99481e', attribution_status: 'organic', attributed_install_click_id: null, opened_at: '2026-04-29T10:30:00.000Z' } } },
        duplicate: { value: { Status: { Code: 200, Description: 'Duplicate install open detected.' }, Parameters: { success: true, install_open_id: '6d42d537-8f25-4e8c-bd1c-b7f16b99481e', attribution_status: 'duplicate', attributed_install_click_id: null, opened_at: '2026-04-29T10:35:00.000Z' } } },
      },
    },
  })
  @ApiBadRequestResponse({ schema: { example: { success: false, error_code: 'BAD_REQUEST', message: 'device_id is required' } } })
  @ApiUnauthorizedResponse({ schema: { example: { success: false, error_code: 'UNAUTHORIZED', message: 'invalid API key' } } })
  create(@Body() dto: CreateInstallOpenDto) { return this.service.create(dto); }
}
