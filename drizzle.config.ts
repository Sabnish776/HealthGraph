import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_WZi2oImV9hpr@ep-odd-salad-a13yb4v2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
});
