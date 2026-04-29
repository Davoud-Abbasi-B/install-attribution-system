import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IdentityDto { @IsString() Token!: string; }
class ParametersDto {
  @IsString() product_name!: string;
  @IsString() package_name!: string;
  @IsString() device_id!: string;
  @IsOptional() @IsString() store?: string;
  @IsOptional() @IsUUID() install_click_id?: string;
  @IsOptional() @IsString() token?: string;
  @IsOptional() @IsString() referrer_raw?: string;
  @IsOptional() @IsString() app_version?: string;
  @IsOptional() @IsString() os_version?: string;
}
export class CreateInstallOpenDto {
  @ValidateNested() @Type(() => IdentityDto) Identity!: IdentityDto;
  @ValidateNested() @Type(() => ParametersDto) Parameters!: ParametersDto;
}
