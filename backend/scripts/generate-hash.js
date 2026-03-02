/**
 * Password Hash Generator for Admin Users
 * 
 * Usage:
 *   node scripts/generate-hash.js your_password_here
 * 
 * Example:
 *   node scripts/generate-hash.js edizo@admin2025
 */

import bcrypt from 'bcryptjs';

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Password is required');
  console.log('\nUsage:');
  console.log('  node scripts/generate-hash.js your_password_here');
  console.log('\nExample:');
  console.log('  node scripts/generate-hash.js edizo@admin2025');
  process.exit(1);
}

// Validate password length
if (password.length < 6) {
  console.error('❌ Error: Password must be at least 6 characters long');
  process.exit(1);
}

console.log('\n🔐 Generating bcrypt hash...\n');

// Generate hash
const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('═══════════════════════════════════════════════════════════');
console.log('                    PASSWORD HASH GENERATED                 ');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('Original Password:', password);
console.log('Hash Length:', hash.length);
console.log('\nGenerated Hash:\n');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log(`│ ${hash} │`);
console.log('└─────────────────────────────────────────────────────────┘\n');

console.log('═══════════════════════════════════════════════════════════');
console.log('                     SQL INSERT STATEMENT                   ');
console.log('═══════════════════════════════════════════════════════════\n');

const sql = `
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  '${hash}',
  'Edizo Admin',
  'admin',
  true,
  true
);
`;

console.log(sql);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('                          USAGE                             ');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('1. Copy the SQL statement above');
console.log('2. Run it in your MySQL database:');
console.log('   mysql -u root -p edizo_db\n');
console.log('3. Or paste the hash directly in your database management tool\n');

console.log('📝 Note: Store this hash securely. It cannot be reversed!\n');

// Verify the hash works
console.log('═══════════════════════════════════════════════════════════');
console.log('                      VERIFICATION                          ');
console.log('═══════════════════════════════════════════════════════════\n');

const isValid = bcrypt.compareSync(password, hash);
console.log('Password matches hash:', isValid ? '✅ Yes' : '❌ No');
console.log('Hash algorithm: bcrypt');
console.log('Salt rounds:', saltRounds);
console.log('\n✅ Hash generation complete!\n');
