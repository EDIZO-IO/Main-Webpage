import { createPool } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const pool = createPool({
  host: '100.110.78.25',
  user: 'remote_user',
  password: 'Ananth01@12',
  database: 'edizo_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function runMigration() {
  try {
    console.log('Connecting to database...');
    const connection = await pool.getConnection();
    console.log('Connected successfully!');

    // Read SQL file
    const sqlFile = path.join(__dirname, 'create_certificates_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Creating certificates table...');
    await connection.query(sql);
    console.log('✅ Certificates table created successfully!');

    // Verify table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "certificates"');
    if (tables.length > 0) {
      console.log('✅ Verified: certificates table exists in database');
    }

    connection.release();
    await pool.end();
    console.log('Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runMigration();
