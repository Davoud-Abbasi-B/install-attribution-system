import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateInstallLinkDto } from './dto/create-install-link.dto';

@Injectable()
export class InstallLinksService {
  constructor(private readonly db: DatabaseService, private readonly config: ConfigService) {}

  async create(dto: CreateInstallLinkDto) {
    const token = randomBytes(4).toString('hex');
    const result = await this.db.query(
      `INSERT INTO install_links (token, product_name, package_name, campaign_name, media_source, channel, destination_store, destination_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING token, product_name, campaign_name, media_source, destination_store`,
      [token, dto.product_name, dto.package_name, dto.campaign_name ?? null, dto.media_source ?? null, dto.channel ?? null, dto.destination_store ?? null, dto.destination_url],
    );
    const base = this.config.get('PUBLIC_BASE_URL', 'http://192.168.3.64:3001');
    return { success: true, install_link: { ...(result.rows[0] as Record<string, unknown>), install_url: `${base}/i/${token}` } };
  }
}
