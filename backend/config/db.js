import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  database: process.env.PG_DATABASE || 'dac_system',
  password: process.env.PG_PASSWORD || 'your_postgres_password',
  port: Number(process.env.PG_PORT) || 5432,
});

export default pool;
