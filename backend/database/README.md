# 📊 EDIZO Database Setup Guide

## Overview

This guide explains how to set up the MySQL database for the EDIZO platform.

---

## 📁 SQL Files

### 1. **Complete Schema** (NEW INSTALLATIONS)
**File:** `backend/database/edizo_complete_schema.sql`

**Use this for:**
- ✅ Fresh installations
- ✅ New databases
- ✅ Development environments

**What it does:**
- Creates `edizo_db` database
- Creates all 12 tables
- Adds all indexes
- Inserts initial stats data
- Creates admin user function

---

### 2. **Migration File** (EXISTING DATABASES)
**File:** `backend/database/migrations/all_updates.sql`

**Use this for:**
- ✅ Existing databases
- ✅ Adding new features
- ✅ Updating schema

**What it does:**
- Adds image upload columns
- Creates projects table (if missing)
- Updates testimonials table
- Updates events table
- Adds performance indexes

---

### 3. **Old Schema File** (DEPRECATED)
**File:** `backend/database/schema.sql`

**Status:** ⚠️ **DEPRECATED - Use `edizo_complete_schema.sql` instead**

---

## 🚀 Installation

### For NEW Installations:

```bash
# 1. Open MySQL command line or Workbench
mysql -u root -p

# 2. Run the complete schema
source backend/database/edizo_complete_schema.sql

# 3. Verify tables were created
USE edizo_db;
SHOW TABLES;

# Should show 12 tables
```

### For EXISTING Databases:

```bash
# 1. Backup your database first!
mysqldump -u root -p edizo_db > backup_$(date +%Y%m%d).sql

# 2. Run the migration
mysql -u root -p edizo_db < backend/database/migrations/all_updates.sql

# 3. Verify changes
mysql -u root -p edizo_db -e "SHOW TABLES;"
```

---

## 📋 Tables Created

| # | Table | Purpose |
|---|-------|---------|
| 1 | `users` | User accounts & authentication |
| 2 | `services` | Services offered |
| 3 | `internships` | Internship programs |
| 4 | `internship_applications` | Application tracking |
| 5 | `certificates` | Certificate management |
| 6 | `team_members` | Team profiles |
| 7 | `events` | Events & webinars |
| 8 | `projects` | Project portfolio |
| 9 | `testimonials` | Client reviews |
| 10 | `contact_submissions` | Contact form data |
| 11 | `stats` | Dashboard statistics |
| 12 | `blogs` | Blog posts |

---

## 🔧 Create Admin User

### Option 1: Using the Function

```sql
USE edizo_db;

-- Create admin user
SELECT create_admin_user('admin@edizo.in', 'Edizo Admin', 'your_password_here');
```

### Option 2: Manual Insert

```sql
-- First generate a bcrypt hash (use backend script)
cd backend
npm run generate-hash your_password_here

-- Then insert with the hash
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  '$2a$10$YOUR_HASH_HERE',
  'Edizo Admin',
  'admin',
  true,
  true
);
```

---

## 📊 Insert Sample Data

### Services:
```sql
INSERT INTO services (id, title, slug, short_description, description, category, is_active, is_featured)
VALUES 
  (UUID(), 'Web Development', 'web-development', 'Custom web solutions', 'Full stack web development', 'Development', true, true),
  (UUID(), 'UI/UX Design', 'ui-ux', 'Beautiful interfaces', 'User-centered design', 'Design', true, true),
  (UUID(), 'Mobile Apps', 'app-development', 'iOS & Android apps', 'Cross-platform mobile development', 'Development', true, false);
```

### Testimonials:
```sql
INSERT INTO testimonials (id, customer_name, customer_email, rating, content, service_type, is_approved)
VALUES 
  (UUID(), 'John Doe', 'john@example.com', 5, 'Great service!', 'Web Development', true),
  (UUID(), 'Jane Smith', 'jane@example.com', 5, 'Highly recommended', 'UI/UX Design', true);
```

### Projects:
```sql
INSERT INTO projects (id, title, slug, short_description, client_name, project_type, is_active, is_featured)
VALUES 
  (UUID(), 'E-commerce Platform', 'ecommerce-platform', 'Online shopping solution', 'Client Name', 'Web Development', true, true),
  (UUID(), 'Mobile Banking App', 'mobile-banking-app', 'iOS & Android app', 'Bank Client', 'Mobile App', true, false);
```

### Events:
```sql
INSERT INTO events (id, title, slug, event_type, description, start_date, mode, is_active)
VALUES 
  (UUID(), 'Web Development Workshop', 'web-dev-workshop', 'Workshop', 'Learn modern web development', DATE_ADD(NOW(), INTERVAL 7 DAY), 'Online', true),
  (UUID(), 'UI/UX Design Masterclass', 'ui-ux-masterclass', 'Webinar', 'Master user-centered design', DATE_ADD(NOW(), INTERVAL 14 DAY), 'Hybrid', true);
```

---

## 🔍 Verify Installation

### Check all tables exist:
```sql
USE edizo_db;
SHOW TABLES;

-- Should show 12 tables
```

### Check table structure:
```sql
DESCRIBE services;
DESCRIBE internships;
DESCRIBE projects;
DESCRIBE testimonials;
DESCRIBE events;
```

### Check image columns:
```sql
-- Services images
SHOW COLUMNS FROM services LIKE '%image%';

-- Internships images
SHOW COLUMNS FROM internships LIKE '%image%';

-- Projects images
SHOW COLUMNS FROM projects LIKE '%image%';
```

### Check data:
```sql
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM internships;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM testimonials WHERE is_approved = true;
SELECT COUNT(*) FROM events WHERE is_active = true;
SELECT COUNT(*) FROM stats;
```

---

## 🛠️ Troubleshooting

### Error: "Table already exists"
**Solution:** You're running the complete schema on an existing database. Use the migration file instead:
```bash
mysql -u root -p edizo_db < backend/database/migrations/all_updates.sql
```

### Error: "Column already exists"
**Solution:** Some columns already exist. The migration file handles this with `IF NOT EXISTS`.

### Error: "Database not found"
**Solution:** Create the database first:
```sql
CREATE DATABASE edizo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Admin user can't login
**Solution:** Regenerate the password hash:
```bash
cd backend
npm run generate-hash new_password_here
```

Then update the database:
```sql
UPDATE users 
SET password_hash = 'NEW_HASH_HERE' 
WHERE email = 'admin@edizo.in';
```

---

## 📝 File Structure

```
backend/
└── database/
    ├── edizo_complete_schema.sql    ← NEW: Use for fresh installs
    ├── schema.sql                    ← OLD: Deprecated
    └── migrations/
        ├── all_updates.sql           ← Use for existing databases
        └── add_image_upload_support.sql  ← OLD: Deprecated
```

---

## 🎯 Quick Start Commands

### Complete Setup (New):
```bash
# Create database and run schema
mysql -u root -p < backend/database/edizo_complete_schema.sql

# Verify
mysql -u root -p edizo_db -e "SHOW TABLES;"

# Create admin user
mysql -u root -p edizo_db -e "SELECT create_admin_user('admin@edizo.in', 'Admin', 'password123');"
```

### Update Existing:
```bash
# Backup first
mysqldump -u root -p edizo_db > backup.sql

# Run migration
mysql -u root -p edizo_db < backend/database/migrations/all_updates.sql

# Verify
mysql -u root -p edizo_db -e "SHOW TABLES;"
```

---

## 📞 Support

For database issues:
1. Check error logs: `mysql -u root -p -e "SHOW ERRORS;"`
2. Verify MySQL version: `SELECT VERSION();`
3. Check table status: `SHOW TABLE STATUS FROM edizo_db;`

---

**Last Updated:** 2025-03-01  
**Version:** 2.0  
**MySQL Version Required:** 8.0+
