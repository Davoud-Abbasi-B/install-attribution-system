import { readFileSync } from 'fs';
import { Pool } from 'pg';

const sql = readFileSync('migrations/001_create_install_attribution_schema.sql', 'utf8');

const pool = new Pool({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5434),
  user: process.env.DATABASE_USER ?? 'install_tracking',
  password: process.env.DATABASE_PASSWORD ?? 'install_tracking',
  database: process.env.DATABASE_NAME ?? 'install_tracking',
});

pool.query(sql)
  .then(() => { console.log('Migrations executed successfully'); })
  .finally(async () => { await pool.end(); });
