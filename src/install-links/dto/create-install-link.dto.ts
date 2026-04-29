import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateInstallLinkDto {
  @IsString() @IsNotEmpty() product_name!: string;
  @IsString() @IsNotEmpty() package_name!: string;
  @IsString() @IsOptional() campaign_name?: string;
  @IsString() @IsOptional() media_source?: string;
  @IsString() @IsOptional() channel?: string;
  @IsString() @IsOptional() destination_store?: string;
  @IsUrl() destination_url!: string;
}
