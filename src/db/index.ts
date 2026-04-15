import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_WZi2oImV9hpr@ep-odd-salad-a13yb4v2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

export const db = drizzle(pool, { schema });
