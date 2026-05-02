import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

class IdentityDto {
  @ApiProperty({ example: 'E61165CBE2B74373B90EBA23C6805412', description: 'Mobile app identity token.' })
  @IsString() Token!: string;
}

class ParametersDto {
  @ApiProperty({ example: 'ghabzino', description: 'Product name.' })
  @IsString() product_name!: string;

  @ApiProperty({ example: 'com.ayanco.ghabzino', description: 'Android package name of the app.' })
  @IsString() package_name!: string;

  @ApiProperty({ example: 'device_123', description: 'Stable app-side device identifier.' })
  @IsString() device_id!: string;

  @ApiPropertyOptional({ example: 'cafebazaar', description: 'Install store name.' })
  @IsOptional() @IsString() store?: string;

  @ApiPropertyOptional({ example: '2a4162fa-264e-4db5-93dd-9d9b87cefc78', description: 'install_click_id extracted from referrer/query.', nullable: true })
  @IsOptional() @IsUUID() install_click_id?: string;

  @ApiPropertyOptional({ example: 'gzb1405', description: 'Install link token.', nullable: true })
  @IsOptional() @IsString() token?: string;

  @ApiPropertyOptional({ example: 'ayanco_token=gzb1405&ayanco_install_click_id=2a4162fa-264e-4db5-93dd-9d9b87cefc78&utm_source=tapsell&utm_campaign=car_transfer_launch', description: 'Raw referrer/query value for debugging.', nullable: true })
  @IsOptional() @IsString() referrer_raw?: string;

  @ApiPropertyOptional({ example: '5.2.0', description: 'App version.' })
  @IsOptional() @IsString() app_version?: string;

  @ApiPropertyOptional({ example: 'Android 14', description: 'OS version.' })
  @IsOptional() @IsString() os_version?: string;
}

export class CreateInstallOpenDto {
  @ApiProperty({ type: IdentityDto })
  @ValidateNested() @Type(() => IdentityDto) Identity!: IdentityDto;

  @ApiProperty({ type: ParametersDto })
  @ValidateNested() @Type(() => ParametersDto) Parameters!: ParametersDto;
}
