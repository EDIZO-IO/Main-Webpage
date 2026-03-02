# ✅ Admin User Management - Setup Complete

## What Was Created

### Backend Files
1. **`backend/routes/users.js`** - API routes for user management
   - GET `/api/users` - List all users
   - POST `/api/users` - Create new admin (super_admin only)
   - PUT `/api/users/:id` - Update user
   - PUT `/api/users/:id/reset-password` - Reset password
   - DELETE `/api/users/:id` - Delete user

2. **`backend/scripts/generate-hash.js`** - Password hash generator
   - Usage: `npm run generate-hash your_password`

3. **`backend/scripts/generate-hash-interactive.js`** - Interactive hash generator
   - Usage: `npm run generate-hash:interactive`

4. **`backend/ADMIN_USER_GUIDE.md`** - Complete documentation

---

## Quick Start - Create Your First Admin User

### Option 1: Using Script (Recommended)

```bash
cd backend

# Generate hash for your password
npm run generate-hash edizo@admin2025

# Copy the SQL output and run in MySQL
```

### Option 2: Interactive Mode

```bash
cd backend

# Prompts for password securely
npm run generate-hash:interactive
```

### Option 3: Direct SQL (After generating hash)

```sql
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  '$2a$10$YOUR_GENERATED_HASH_HERE',
  'Edizo Admin',
  'admin',
  true,
  true
);
```

---

## Using Admin Panel to Create Users

Once you have a **super_admin** account:

1. **Login** at http://localhost:5174
2. Navigate to **Admin Users** in sidebar
3. Click **Create Admin User**
4. Fill in:
   - Full Name
   - Email
   - Password (min 6 chars)
   - Phone (optional)
   - Role: Admin or Super Admin
5. Click **Create**

---

## Features Available

### Admin Users Manager Page
- ✅ View all admin users
- ✅ Create new admin users
- ✅ Reset user passwords
- ✅ Activate/Deactivate users
- ✅ Delete users
- ✅ Search users
- ✅ View user roles and status

### Security Features
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Minimum 6 character password requirement
- ✅ Role-based access control
- ✅ Super admin required for user creation
- ✅ Cannot delete your own account

---

## API Endpoints

```
GET    /api/users              - List users (admin)
POST   /api/users              - Create user (super_admin)
GET    /api/users/:id          - Get user by ID (admin)
PUT    /api/users/:id          - Update user (super_admin)
PUT    /api/users/:id/reset-password - Reset password (super_admin)
DELETE /api/users/:id          - Delete user (super_admin)
```

---

## User Roles

| Role | Can Do |
|------|--------|
| **admin** | Manage internships, certificates, applications, teams, etc. |
| **super_admin** | All admin permissions + create/manage admin users |

---

## Default Credentials

After initial setup:
- **Email**: admin@edizo.in
- **Password**: edizo@admin2025

**⚠️ Change this immediately in production!**

---

## Files Updated in Admin Panel

1. **`admin/src/api/api.ts`** - Added `usersAPI` methods
2. **`admin/src/pages/AdminUsersManager.tsx`** - User management UI
3. **`admin/src/App.tsx`** - Added `/users` route
4. **`admin/src/components/Layout.tsx`** - Added "Admin Users" menu item

---

## Next Steps

1. **Generate password hash:**
   ```bash
   cd backend
   npm run generate-hash your_password
   ```

2. **Create admin user in MySQL:**
   ```sql
   -- Paste the SQL from the script output
   ```

3. **Start all services:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Admin
   cd admin && npm run dev
   ```

4. **Login to admin panel:**
   - URL: http://localhost:5174
   - Email: admin@edizo.in
   - Password: (your password)

5. **Create more admin users:**
   - Go to Admin Users page
   - Click "Create Admin User"

---

## Documentation

- **Full Guide**: `backend/ADMIN_USER_GUIDE.md`
- **API Docs**: `backend/README.md`
- **Setup Guide**: `SETUP_GUIDE.md`

---

**Status**: ✅ Complete and Ready to Use
**Version**: 2.0
