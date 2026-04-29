import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InstallClicksService {
  constructor(private readonly db: DatabaseService) {}

  async processClick(token: string, ipAddress?: string, userAgent?: string) {
    const linkRes = await this.db.query('SELECT * FROM install_links WHERE token = $1', [token]);
    const link = linkRes.rows[0] as any;
    if (!link) throw new NotFoundException('Install link not found');
    if (!link.is_active) throw new GoneException('Install link is inactive');

    const installClickId = uuidv4();
    const url = new URL(link.destination_url);
    url.searchParams.set('ayanco_token', link.token);
    url.searchParams.set('ayanco_install_click_id', installClickId);
    if (link.media_source) url.searchParams.set('utm_source', link.media_source);
    if (link.campaign_name) url.searchParams.set('utm_campaign', link.campaign_name);
    const redirectUrl = url.toString();

    await this.db.query(
      `INSERT INTO install_clicks (install_click_id, install_link_id, token, product_name, package_name, campaign_name, media_source, channel, ip_address, user_agent, redirect_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [installClickId, link.id, link.token, link.product_name, link.package_name, link.campaign_name, link.media_source, link.channel, ipAddress ?? null, userAgent ?? null, redirectUrl],
    );

    return { redirectUrl };
  }
}
