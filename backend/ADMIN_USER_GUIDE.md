# Admin User Creation Guide

## Overview

This guide explains how to create and manage admin users for the EDIZO admin panel.

---

## Method 1: Using Password Hash Generator (Recommended)

### Step 1: Generate Password Hash

Open a terminal in the `backend` directory and run:

```bash
# Interactive mode (prompts for password)
npm run generate-hash:interactive

# OR provide password directly
npm run generate-hash your_password_here
```

**Example:**
```bash
npm run generate-hash edizo@admin2025
```

### Step 2: Copy the SQL Statement

The script will output a SQL INSERT statement like this:

```sql
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  '$2a$10$xyz...',
  'Edizo Admin',
  'admin',
  true,
  true
);
```

### Step 3: Execute in MySQL

**Option A: MySQL Command Line**
```bash
mysql -u root -p edizo_db
# Paste the SQL statement
```

**Option B: MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your database
3. Open a new query tab
4. Paste and execute the SQL

**Option C: phpMyAdmin**
1. Open phpMyAdmin
2. Select `edizo_db` database
3. Click "SQL" tab
4. Paste and execute the SQL

---

## Method 2: Direct SQL (Quick Setup)

If you just want to create the default admin user quickly:

```sql
-- First, generate a hash using the script, then use this template:
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  'PASTE_YOUR_GENERATED_HASH_HERE',
  'Edizo Admin',
  'admin',
  true,
  true
);
```

**⚠️ Important:** Replace `PASTE_YOUR_GENERATED_HASH_HERE` with the actual hash from the generator.

---

## Method 3: Using Admin Panel (After Setup)

Once you have at least one **super_admin** user:

1. Login to admin panel: http://localhost:5174
2. Navigate to **Admin Users** in the sidebar
3. Click **Create Admin User**
4. Fill in the details:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Phone (optional)
   - Role (Admin or Super Admin)
5. Click **Create User**

**Note:** This requires the backend `/api/users` endpoint and super_admin authentication.

---

## Creating Multiple Admin Users

To create additional admin users with different roles:

```sql
-- Create Admin User
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'john@edizo.in',
  '$2a$10$GENERATED_HASH',
  'John Doe',
  'admin',
  true,
  true
);

-- Create Super Admin User
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'jane@edizo.in',
  '$2a$10$GENERATED_HASH',
  'Jane Smith',
  'super_admin',
  true,
  true
);
```

---

## User Roles Explained

| Role | Permissions | Access Level |
|------|-------------|--------------|
| `user` | Basic user access | Frontend only |
| `admin` | Manage content (internships, certificates, applications) | Admin panel |
| `super_admin` | Full access including user management | Admin panel + user creation |

---

## Verify Admin User Creation

After creating the user, verify it was created successfully:

```sql
-- Check if user exists
SELECT id, email, full_name, role, is_active, created_at 
FROM users 
WHERE email = 'admin@edizo.in';
```

Expected output:
```
| id | email | full_name | role | is_active | created_at |
|----|-------|-----------|------|-----------|------------|
| ... | admin@edizo.in | Edizo Admin | admin | 1 | 2025-... |
```

---

## Reset Admin Password

### Option 1: Using SQL (Database Reset)

```sql
-- Generate new hash first, then update:
UPDATE users 
SET password_hash = '$2a$10$NEW_HASH' 
WHERE email = 'admin@edizo.in';
```

### Option 2: Using Admin Panel (Super Admin Only)

1. Go to **Admin Users**
2. Click the **Key icon** (Reset Password) next to the user
3. Enter new password twice
4. Click **Reset Password**

---

## Troubleshooting

### "Cannot login with created user"

1. Verify `is_active = 1` in database
2. Check email is exactly as entered (case-sensitive)
3. Ensure password hash was generated correctly
4. Restart backend server

### "Hash generation script not working"

```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies if not already done
npm install

# Try running with node directly
node scripts/generate-hash.js your_password
```

### "User exists error"

Check existing users:
```sql
SELECT email, full_name, role FROM users;
```

Use a different email or delete the existing user:
```sql
DELETE FROM users WHERE email = 'duplicate@email.com';
```

---

## Security Best Practices

1. **Use Strong Passwords**: Min 8 characters, mix of letters, numbers, symbols
2. **Change Defaults**: Always change default admin password in production
3. **Limit Super Admins**: Only create super_admin accounts when needed
4. **Regular Audits**: Periodically review admin users list
5. **Inactive Users**: Set `is_active = 0` instead of deleting

---

## Quick Reference

### Generate Hash
```bash
npm run generate-hash mypassword123
```

### Create Admin SQL Template
```sql
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (UUID(), 'email@example.com', 'HASH_HERE', 'Full Name', 'admin', true, true);
```

### Verify User
```sql
SELECT * FROM users WHERE email = 'admin@edizo.in';
```

### List All Admins
```sql
SELECT email, full_name, role, is_active, created_at 
FROM users 
WHERE role IN ('admin', 'super_admin');
```

---

## Default Credentials (Development Only)

After running the initial setup:

- **Email**: admin@edizo.in
- **Password**: edizo@admin2025

**⚠️ Change these immediately in production!**

---

## Support

For issues or questions about admin user management, contact: edizoofficial@gmail.com
