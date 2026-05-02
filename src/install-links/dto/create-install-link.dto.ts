import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateInstallLinkDto {
  @ApiProperty({ example: 'ghabzino', description: 'Product name. For MVP, use ghabzino.' })
  @IsString() @IsNotEmpty() product_name!: string;

  @ApiProperty({ example: 'com.ayanco.ghabzino', description: 'Android package name of the target app.' })
  @IsString() @IsNotEmpty() package_name!: string;

  @ApiPropertyOptional({ example: 'car_transfer_launch', description: 'Marketing campaign name.' })
  @IsString() @IsOptional() campaign_name?: string;

  @ApiPropertyOptional({ example: 'tapsell', description: 'Traffic source or ad network name.' })
  @IsString() @IsOptional() media_source?: string;

  @ApiPropertyOptional({ example: 'paid', description: 'Marketing channel, such as paid, owned, sms, referral, or organic.' })
  @IsString() @IsOptional() channel?: string;

  @ApiPropertyOptional({ example: 'cafebazaar', description: 'Destination app store, such as cafebazaar, google_play, myket, or direct_apk.' })
  @IsString() @IsOptional() destination_store?: string;

  @ApiProperty({ example: 'https://cafebazaar.ir/app/com.ayanco.ghabzino', description: 'Final app store or download URL.' })
  @IsUrl() destination_url!: string;
}
