import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class InstallReportsService {
  constructor(private readonly db: DatabaseService) {}

  async summary() {
    const [clicks, opens, byStatus] = await Promise.all([
      this.db.query('SELECT COUNT(*)::text AS count FROM install_clicks'),
      this.db.query('SELECT COUNT(*)::text AS count FROM install_opens'),
      this.db.query('SELECT attribution_status, COUNT(*)::text AS count FROM install_opens GROUP BY attribution_status'),
    ]);

    const map = new Map<string, number>((byStatus.rows as any[]).map((r) => [r.attribution_status, Number(r.count)]));
    const clickCount = Number((clicks.rows[0] as any)?.count ?? 0);
    const attributed = map.get('attributed') ?? 0;

    return {
      success: true,
      summary: {
        clicks: clickCount,
        install_opens: Number((opens.rows[0] as any)?.count ?? 0),
        attributed_installs: attributed,
        organic_installs: map.get('organic') ?? 0,
        invalid_click_installs: map.get('invalid_click') ?? 0,
        duplicate_opens: map.get('duplicate') ?? 0,
        click_to_install_rate: clickCount > 0 ? Number(((attributed / clickCount) * 100).toFixed(2)) : 0,
      },
    };
  }
}
