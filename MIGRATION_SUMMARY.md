# EDIZO Platform - MySQL Backend Migration Summary

## ✅ What Has Been Completed

### 1. Backend (Express.js + MySQL)

**Location:** `backend/`

**Created Files:**
- `package.json` - Backend dependencies
- `server.js` - Main Express server
- `config/database.js` - MySQL connection pool
- `middleware/auth.js` - JWT authentication middleware
- `routes/` - API routes for all entities:
  - `auth.js` - Login, register, profile management
  - `internships.js` - Internship CRUD
  - `services.js` - Services CRUD
  - `applications.js` - Internship applications
  - `certificates.js` - Certificates with verification
  - `team.js` - Team members
  - `projects.js` - Projects/Case studies
  - `events.js` - Events/Webinars
  - `testimonials.js` - Reviews/Testimonials
  - `contact.js` - Contact form submissions
  - `stats.js` - Dashboard stats
  - `blogs.js` - Blog posts
- `database/schema.sql` - Complete MySQL schema
- `scripts/migrate.js` - Google Sheets to MySQL migration
- `.env` - Environment configuration
- `README.md` - API documentation

**Features:**
- JWT-based authentication
- Role-based access control (user, admin, super_admin)
- RESTful API endpoints
- MySQL connection pooling
- CORS configuration
- Rate limiting
- Input validation
- Error handling

---

### 2. Frontend (React + Vite)

**Updated Files:**
- `src/api/api.js` - Complete REST API client
- `src/hooks/useInternships.js` - Internships hook
- `src/hooks/useTeamMembers.js` - Team members hook
- `src/hooks/useStats.js` - Stats hook
- `src/hooks/useEvents.js` - Events hook
- `src/hooks/useServices.js` - Services hook
- `src/hooks/useProjects.js` - Projects hook
- `src/pages/Login.jsx` - User login page
- `src/pages/Register.jsx` - User registration page
- `src/pages/Contact.jsx` - Updated to use API
- `src/pages/CertificateVerification.jsx` - Updated to use API
- `src/App.jsx` - Added auth routes
- `.env` - Updated API configuration

**Features:**
- User authentication (login/register)
- API integration for all data
- Cached data with localStorage
- Toast notifications
- Protected routes ready

---

### 3. Admin Panel (React + TypeScript)

**Updated Files:**
- `src/api/api.ts` - Admin API client with service operations
- `src/pages/Login.tsx` - JWT-based login
- `src/pages/Dashboard.tsx` - Stats from database
- `src/pages/CertificatesManager.tsx` - Full CRUD with database
- `src/pages/InternshipsManager.tsx` - Full CRUD with database
- `src/pages/InternshipApplicationsManager.tsx` - Application management
- `src/App.tsx` - Updated authentication
- `src/main.tsx` - Added ToastContainer
- `.env` - Updated API configuration

**Features:**
- JWT authentication
- Dashboard with stats
- Manage internships (CRUD)
- Manage certificates (CRUD)
- Manage applications (status updates)
- Real-time data from MySQL

---

## 📊 Database Schema

**Tables Created:**
1. `users` - User accounts with authentication
2. `internships` - Internship listings
3. `services` - Services offered
4. `internship_applications` - Application tracking
5. `certificates` - Certificates with verification hash
6. `team_members` - Team profiles
7. `events` - Events and webinars
8. `projects` - Projects/case studies
9. `testimonials` - Customer reviews
10. `contact_submissions` - Contact form data
11. `stats` - Dashboard statistics
12. `blogs` - Blog posts

---

## 🔧 Setup Instructions

### Step 1: Install MySQL

Download and install MySQL 8+ from https://dev.mysql.com/downloads/

### Step 2: Create Database

```sql
CREATE DATABASE edizo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Run Schema

```bash
# From project root
mysql -u root -p edizo_db < backend/database/schema.sql
```

### Step 4: Create Admin User

Generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('edizo@admin2025', 10))"
```

Insert admin user:
```sql
USE edizo_db;
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (UUID(), 'admin@edizo.in', 'PASTE_HASH_HERE', 'Edizo Admin', 'admin', true, true);
```

### Step 5: Configure Environment

**backend/.env:**
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=edizo_db
JWT_SECRET=your-secret-key-change-in-production
```

### Step 6: Start Services

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev
```

**Access URLs:**
- Backend API: http://localhost:3001
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5174

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login
GET    /api/auth/me           - Get current user
PUT    /api/auth/me           - Update profile
PUT    /api/auth/change-password - Change password
```

### Internships
```
GET    /api/internships           - Get all (public)
GET    /api/internships/:id       - Get by ID
GET    /api/internships/admin/all - Get all (admin)
POST   /api/internships           - Create (admin)
PUT    /api/internships/:id       - Update (admin)
DELETE /api/internships/:id       - Delete (admin)
```

### Certificates
```
GET    /api/certificates/verify/:id - Verify (public)
GET    /api/certificates            - Get all (admin)
POST   /api/certificates            - Create (admin)
PUT    /api/certificates/:id        - Update (admin)
DELETE /api/certificates/:id        - Delete (admin)
```

### Applications
```
GET    /api/applications         - Get user's applications
POST   /api/applications         - Submit application
GET    /api/applications         - Get all (admin)
PUT    /api/applications/:id     - Update (admin)
DELETE /api/applications/:id     - Delete (admin)
```

*(Similar CRUD endpoints for Services, Projects, Events, Team, etc.)*

---

## 🔐 Authentication Flow

1. **Login:** POST `/api/auth/login` → Returns JWT token
2. **Store Token:** Save token in localStorage
3. **API Requests:** Include `Authorization: Bearer <token>` header
4. **Token Expiry:** 7 days (configurable)
5. **Auto-logout:** On 401 error, redirect to login

---

## 📝 Migration from Google Sheets

If you have existing data in Google Sheets:

1. Update `backend/.env`:
```env
VITE_GOOGLE_SHEET_ID=your_sheet_id
VITE_GOOGLE_API_KEY=your_api_key
```

2. Run migration:
```bash
cd backend
npm run migrate
```

This will transfer:
- Internships
- Team Members
- Stats
- Services
- Events

---

## 🚀 Production Deployment

### Backend
```bash
cd backend
npm install --production
npm start
```

Use PM2 for process management:
```bash
pm2 start server.js --name edizo-backend
pm2 save
pm2 startup
```

### Frontend & Admin
```bash
cd frontend
npm run build
# Deploy 'dist' folder

cd admin
npm run build
# Deploy 'dist' folder
```

---

## 📦 Default Credentials

**Admin Panel:**
- Email: `admin@edizo.in`
- Password: `edizo@admin2025` (or the one you set)

**⚠️ Change these immediately in production!**

---

## 🛠️ Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql --version`
- Verify credentials in `.env`
- Check port 3001 is available

### Can't connect to database
- Verify MySQL user permissions
- Check firewall settings
- Test: `mysql -u root -p`

### Frontend/Admin can't fetch data
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in `server.js`
- Ensure backend is running

---

## 📄 Files Modified/Created

### Backend (New)
```
backend/
├── package.json
├── server.js
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── internships.js
│   ├── services.js
│   ├── applications.js
│   ├── certificates.js
│   ├── team.js
│   ├── projects.js
│   ├── events.js
│   ├── testimonials.js
│   ├── contact.js
│   ├── stats.js
│   └── blogs.js
├── scripts/
│   └── migrate.js
├── database/
│   └── schema.sql
├── .env
├── .env.example
└── README.md
```

### Frontend (Updated)
```
frontend/
├── src/
│   ├── api/
│   │   └── api.js (NEW)
│   ├── hooks/
│   │   ├── useInternships.js (NEW)
│   │   ├── useTeamMembers.js (NEW)
│   │   ├── useStats.js (NEW)
│   │   ├── useEvents.js (NEW)
│   │   ├── useServices.js (NEW)
│   │   └── useProjects.js (NEW)
│   ├── pages/
│   │   ├── Login.jsx (NEW)
│   │   └── Register.jsx (NEW)
│   ├── App.jsx (UPDATED)
│   └── .env (UPDATED)
```

### Admin (Updated)
```
admin/
├── src/
│   ├── api/
│   │   └── api.ts (NEW)
│   ├── pages/
│   │   ├── Login.tsx (UPDATED)
│   │   ├── Dashboard.tsx (UPDATED)
│   │   ├── CertificatesManager.tsx (UPDATED)
│   │   ├── InternshipsManager.tsx (UPDATED)
│   │   └── InternshipApplicationsManager.tsx (UPDATED)
│   ├── App.tsx (UPDATED)
│   ├── main.tsx (UPDATED)
│   └── .env (UPDATED)
```

---

## 🎯 Next Steps

1. **Install MySQL** and create database
2. **Run schema** to create tables
3. **Create admin user** with bcrypt password
4. **Configure .env** files in all three projects
5. **Start backend**: `cd backend && npm run dev`
6. **Start frontend**: `cd frontend && npm run dev`
7. **Start admin**: `cd admin && npm run dev`
8. **Test login** at http://localhost:5174
9. **Migrate data** from Google Sheets (optional)
10. **Deploy** to production

---

## 📞 Support

For issues or questions:
- Email: edizoofficial@gmail.com

---

**Migration Completed:** ✓
**Status:** Ready for Testing
**Version:** 2.0
