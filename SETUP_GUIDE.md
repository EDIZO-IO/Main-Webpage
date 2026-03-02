# EDIZO Platform - Complete Setup Guide

## Overview

This guide covers the complete setup of the EDIZO platform with:
- **Backend**: Express.js + MySQL
- **Frontend**: React + Vite
- **Admin Panel**: React + TypeScript + Vite

---

## Prerequisites

- Node.js 18+ installed
- MySQL 8+ installed
- Git installed

---

## Part 1: Backend Setup

### 1.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 1.2 Configure Environment Variables

Edit `backend/.env`:

```env
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=edizo_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### 1.3 Set Up MySQL Database

1. **Open MySQL command line or workbench**

2. **Create database and run schema**:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS edizo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE edizo_db;

-- Run the schema (copy contents from backend/database/schema.sql)
-- Or execute the file:
source backend/database/schema.sql;
```

3. **Create Admin User**:

First, generate a bcrypt hash for the password:

```bash
node -e "console.log(require('bcryptjs').hashSync('edizo@admin2025', 10))"
```

Copy the hash and run:

```sql
USE edizo_db;

INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  'PASTE_YOUR_BCRYPT_HASH_HERE',
  'Edizo Admin',
  'admin',
  true,
  true
);
```

### 1.4 Migrate Data from Google Sheets (Optional)

If you have existing data in Google Sheets:

```bash
# Update backend/.env with your Google Sheets credentials
VITE_GOOGLE_SHEET_ID=your_sheet_id
VITE_GOOGLE_API_KEY=your_api_key

# Run migration
npm run migrate
```

### 1.5 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on: `http://localhost:3001`

---

## Part 2: Frontend Setup

### 2.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2.2 Configure Environment Variables

Edit `frontend/.env`:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:3001
# For production, use your actual API URL
# VITE_API_URL=https://api.edizo.in
```

### 2.3 Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## Part 3: Admin Panel Setup

### 3.1 Install Admin Dependencies

```bash
cd admin
npm install
```

### 3.2 Configure Environment Variables

Edit `admin/.env`:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:3001
# For production, use your actual API URL
# VITE_API_URL=https://api.edizo.in
```

### 3.3 Start Admin Development Server

```bash
npm run dev
```

Admin panel will run on: `http://localhost:5174`

---

## Part 4: Testing the Setup

### 4.1 Test Backend API

Open browser or use curl:

```bash
# Health check
curl http://localhost:3001/health

# Get internships
curl http://localhost:3001/api/internships

# Get services
curl http://localhost:3001/api/services

# Get stats
curl http://localhost:3001/api/stats
```

### 4.2 Test Admin Login

1. Go to `http://localhost:5174`
2. Login with:
   - Email: `admin@edizo.in`
   - Password: `edizo@admin2025` (or the password you set)

### 4.3 Test Frontend

1. Go to `http://localhost:5173`
2. Browse internships, services, projects
3. Test contact form
4. Test certificate verification

---

## Part 5: Production Deployment

### 5.1 Backend Production Setup

1. **Update environment variables for production**:

```env
NODE_ENV=production
JWT_SECRET=super-secure-random-string-min-32-chars
DB_HOST=your-production-db-host
DB_PASSWORD=secure-production-password
FRONTEND_URL=https://www.edizo.in
ADMIN_URL=https://admin.edizo.in
```

2. **Build and start**:

```bash
npm install --production
npm start
```

3. **Use PM2 for process management** (recommended):

```bash
npm install -g pm2
pm2 start server.js --name edizo-backend
pm2 save
pm2 startup
```

### 5.2 Frontend Production Build

```bash
cd frontend

# Update .env for production
echo "VITE_API_URL=https://api.edizo.in" > .env

# Build
npm run build

# Deploy the 'dist' folder to your hosting
```

### 5.3 Admin Production Build

```bash
cd admin

# Update .env for production
echo "VITE_API_URL=https://api.edizo.in" > .env

# Build
npm run build

# Deploy the 'dist' folder to your hosting
```

---

## Part 6: Database Management

### Backup Database

```bash
mysqldump -u root -p edizo_db > edizo_backup.sql
```

### Restore Database

```bash
mysql -u root -p edizo_db < edizo_backup.sql
```

### Reset Database

```sql
DROP DATABASE IF EXISTS edizo_db;
CREATE DATABASE edizo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Then run schema.sql again
```

---

## Troubleshooting

### Backend won't start

1. Check MySQL is running: `mysql --version`
2. Verify database credentials in `.env`
3. Check port 3001 is not in use

### Frontend/Admin can't connect to backend

1. Verify `VITE_API_URL` in `.env`
2. Check CORS settings in `backend/server.js`
3. Ensure backend is running

### Database connection errors

1. Verify MySQL user has proper permissions
2. Check firewall settings
3. Test connection: `mysql -u root -p`

### Migration fails

1. Verify Google Sheets API key is valid
2. Check sheet names match exactly
3. Ensure network connection is stable

---

## Default Credentials

### Admin Panel
- **Email**: admin@edizo.in
- **Password**: edizo@admin2025

**⚠️ Change this immediately in production!**

---

## API Documentation

See `backend/README.md` for complete API endpoint documentation.

---

## Support

For issues or questions:
- Email: edizoofficial@gmail.com
- Check existing documentation in the project

---

## License

MIT License - EDIZO Platform
