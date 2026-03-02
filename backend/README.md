# EDIZO Backend

Express.js + MySQL backend for the EDIZO platform.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and other settings.

### 3. Set Up MySQL Database

1. Install MySQL if not already installed
2. Create the database:

```sql
CREATE DATABASE edizo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Run the schema:

```bash
mysql -u root -p edizo_db < database/schema.sql
```

Or manually execute the SQL in `database/schema.sql`

### 4. Create Admin User

Run this SQL to create the initial admin user:

```sql
USE edizo_db;

-- Password: edizo@admin2025 (hashed with bcrypt)
INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  '$2a$10$YourBcryptHashHere',
  'Edizo Admin',
  'admin',
  true,
  true
);
```

**Note:** You'll need to generate a proper bcrypt hash for the password. Use this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('edizo@admin2025', 10);
console.log(hash);
```

### 5. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/change-password` - Change password

### Internships
- `GET /api/internships` - Get all internships (public)
- `GET /api/internships/:id` - Get internship by ID
- `GET /api/internships/admin/all` - Get all internships (admin)
- `POST /api/internships` - Create internship (admin)
- `PUT /api/internships/:id` - Update internship (admin)
- `DELETE /api/internships/:id` - Delete internship (admin)

### Services
- `GET /api/services` - Get all services (public)
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/admin/all` - Get all services (admin)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Applications
- `GET /api/applications` - Get applications (auth required)
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Update application (admin)

### Certificates
- `GET /api/certificates/verify/:id` - Verify certificate (public)
- `GET /api/certificates` - Get certificates (admin)
- `POST /api/certificates` - Create certificate (admin)
- `PUT /api/certificates/:id` - Update certificate (admin)

### Team Members
- `GET /api/team` - Get team members (public)
- `POST /api/team` - Create team member (admin)
- `PUT /api/team/:id` - Update team member (admin)
- `DELETE /api/team/:id` - Delete team member (admin)

### Projects
- `GET /api/projects` - Get projects (public)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Events
- `GET /api/events` - Get events (public)
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Testimonials
- `GET /api/testimonials` - Get testimonials (public)
- `POST /api/testimonials` - Submit testimonial
- `PUT /api/testimonials/:id` - Approve/reject testimonial (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get submissions (admin)
- `PUT /api/contact/:id` - Update submission (admin)

### Stats
- `GET /api/stats` - Get stats (public)
- `POST /api/stats` - Create stat (admin)
- `PUT /api/stats/:id` - Update stat (admin)

### Blogs
- `GET /api/blogs` - Get published blogs (public)
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

See `database/schema.sql` for the complete database schema.

## Migration from Google Sheets

To migrate data from Google Sheets to MySQL, use the migration script:

```bash
npm run migrate
```

This will require:
- Google Sheets API key
- Sheet ID
- Proper data mapping

## License

MIT
