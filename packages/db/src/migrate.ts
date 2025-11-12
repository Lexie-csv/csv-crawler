import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/csv_crawler',
});

export async function migrate(): Promise<void> {
    const client = await pool.connect();
    try {
        const migrationPath = path.join(__dirname, '../migrations/001_init_schema.sql');
        const sql = fs.readFileSync(migrationPath, 'utf-8');

        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');

        console.log('✓ Migration 001 completed successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('✗ Migration failed:', error);
        throw error;
    } finally {
        client.release();
    }
}

export async function rollback(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
      DROP TABLE IF EXISTS audit_logs CASCADE;
      DROP TABLE IF EXISTS subscriptions CASCADE;
      DROP TABLE IF EXISTS digests CASCADE;
      DROP TABLE IF EXISTS datapoints CASCADE;
      DROP TABLE IF EXISTS documents CASCADE;
      DROP TABLE IF EXISTS sources CASCADE;
    `);
        console.log('✓ Rollback completed successfully');
    } catch (error) {
        console.error('✗ Rollback failed:', error);
        throw error;
    } finally {
        client.release();
    }
}
