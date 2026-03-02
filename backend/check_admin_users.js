import { createPool } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

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

async function checkAdminUsers() {
  try {
    console.log('Connecting to database...');
    const connection = await pool.getConnection();
    console.log('Connected successfully!');

    // Check for existing admin users
    const [users] = await connection.query(
      'SELECT id, email, full_name, role FROM users WHERE role IN ("admin", "super_admin")'
    );

    console.log('\n=== Existing Admin Users ===');
    if (users.length === 0) {
      console.log('No admin users found in database!');
      
      // Create default admin user
      console.log('\nCreating default admin user...');
      const passwordHash = await bcrypt.hash('admin123', 10);
      const adminId = 'admin-' + Date.now();
      
      await connection.query(
        `INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [adminId, 'admin@edizo.in', passwordHash, 'Edizo Admin', 'admin', true, true]
      );
      
      console.log('✅ Default admin user created successfully!');
      console.log('\n=== Login Credentials ===');
      console.log('Email: admin@edizo.in');
      console.log('Password: admin123');
      console.log('=========================\n');
    } else {
      console.log('Found admin users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.full_name || 'N/A'}) - Role: ${user.role}`);
      });
    }

    connection.release();
    await pool.end();
    console.log('\nDone!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdminUsers();
