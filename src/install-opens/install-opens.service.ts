import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AttributionService } from '../attribution/attribution.service';
import { DatabaseService } from '../database/database.service';
import { CreateInstallOpenDto } from './dto/create-install-open.dto';

@Injectable()
export class InstallOpensService {
  constructor(private readonly db: DatabaseService, private readonly attribution: AttributionService) {}
  async create(dto: CreateInstallOpenDto) {
    const p = dto.Parameters;
    const installOpenId = uuidv4();
    const attribution = await this.attribution.resolve(p.product_name, p.device_id, p.install_click_id);
    const openedAt = new Date().toISOString();

    await this.db.query(
      `INSERT INTO install_opens (install_open_id, product_name, package_name, device_id, store, install_click_id, token, referrer_raw, attributed_install_click_id, attribution_status, app_version, os_version)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [installOpenId, p.product_name, p.package_name, p.device_id, p.store ?? null, p.install_click_id ?? null, p.token ?? null, p.referrer_raw ?? null, attribution.attributedInstallClickId, attribution.attributionStatus, p.app_version ?? null, p.os_version ?? null],
    );

    return {
      Status: { Code: 200, Description: `Install open accepted${attribution.attributionStatus === 'organic' ? ' as organic' : ' successfully'}.` },
      Parameters: { success: true, install_open_id: installOpenId, attribution_status: attribution.attributionStatus, attributed_install_click_id: attribution.attributedInstallClickId, opened_at: openedAt },
    };
  }
}
