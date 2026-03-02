import { createPool } from 'mysql2/promise';

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

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('✅ Connected successfully!');

    // Test all tables that the dashboard needs
    const tables = [
      'users',
      'internships',
      'services',
      'projects',
      'team_members',
      'events',
      'testimonials',
      'certificates',
      'internship_applications',
      'blogs',
      'stats'
    ];

    console.log('\n=== Checking Tables ===\n');
    
    for (const table of tables) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table}: ${rows[0].count} records`);
      } catch (err) {
        console.log(`❌ ${table}: ERROR - ${err.message}`);
      }
    }

    connection.release();
    await pool.end();
    console.log('\n✅ Database check complete!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDatabase();
