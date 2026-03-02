/**
 * Interactive Password Hash Generator
 * 
 * Usage:
 *   node scripts/generate-hash-interactive.js
 * 
 * This script will prompt you to enter a password securely.
 */

import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║        EDIZO Admin Password Hash Generator                ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Hide password input
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

let password = '';

console.log('Enter password (min 6 characters):');
console.log('> ', '');

stdin.on('data', (key) => {
  // Ctrl+C
  if (key === '\u0003') {
    console.log('\n\nCancelled.\n');
    process.exit();
  }
  
  // Enter key
  if (key === '\r') {
    stdin.setRawMode(false);
    stdin.pause();
    
    if (password.length < 6) {
      console.log('\n❌ Error: Password must be at least 6 characters\n');
      process.exit(1);
    }
    
    generateHash(password);
    return;
  }
  
  // Backspace
  if (key === '\u007f' || key === '\b') {
    if (password.length > 0) {
      password = password.slice(0, -1);
      process.stdout.write('\b \b');
    }
    return;
  }
  
  // Regular character
  if (key.length === 1 && !key.startsWith('\u001b')) {
    password += key;
    process.stdout.write('*');
  }
});

function generateHash(password) {
  console.log('\n\n🔐 Generating bcrypt hash...\n');
  
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    PASSWORD HASH GENERATED                 ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Password Length:', password.length);
  console.log('Hash Length:', hash.length);
  console.log('\nGenerated Hash:\n');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log(`│ ${hash} │`);
  console.log('└─────────────────────────────────────────────────────────┘\n');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                     SQL INSERT STATEMENT                   ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const sql = `
-- Create initial admin user
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

-- Verify the user was created
SELECT id, email, full_name, role, created_at FROM users WHERE email = 'admin@edizo.in';
`;
  
  console.log(sql);
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                          USAGE                             ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('1. Copy the SQL statement above');
  console.log('2. Run it in MySQL:');
  console.log('   mysql -u root -p edizo_db < create_admin.sql');
  console.log('\n   Or paste directly in MySQL Workbench/phpMyAdmin\n');
  
  console.log('📝 Security Notes:');
  console.log('   • This hash cannot be reversed');
  console.log('   • Store passwords securely');
  console.log('   • Change default passwords in production');
  console.log('   • Use strong, unique passwords\n');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                      VERIFICATION                          ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const isValid = bcrypt.compareSync(password, hash);
  console.log('✅ Password matches hash:', isValid ? 'Yes' : 'No');
  console.log('✅ Hash algorithm: bcrypt');
  console.log('✅ Salt rounds:', saltRounds);
  console.log('\n✅ Hash generation complete!\n');
  
  rl.close();
  process.exit(0);
}
