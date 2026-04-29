import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AttributionService {
  constructor(private readonly db: DatabaseService) {}

  async resolve(productName: string, deviceId: string, installClickId?: string | null) {
    const duplicate = await this.db.query(
      'SELECT install_open_id FROM install_opens WHERE product_name = $1 AND device_id = $2 LIMIT 1',
      [productName, deviceId],
    );
    if (duplicate.rowCount && duplicate.rowCount > 0) return { attributionStatus: 'duplicate', attributedInstallClickId: null };

    if (!installClickId) return { attributionStatus: 'organic', attributedInstallClickId: null };

    const click = await this.db.query('SELECT install_click_id FROM install_clicks WHERE install_click_id = $1 LIMIT 1', [installClickId]);
    if (click.rowCount && click.rowCount > 0) return { attributionStatus: 'attributed', attributedInstallClickId: installClickId };

    return { attributionStatus: 'invalid_click', attributedInstallClickId: null };
  }
}
