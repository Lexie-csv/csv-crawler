import { Pool } from 'pg';

export function createPool(): Pool {
    return new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/csv_crawler',
    });
}

export { Pool };
