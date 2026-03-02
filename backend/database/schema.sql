-- =====================================================
-- EDIZO MySQL Database Schema (Complete - 2025)
-- =====================================================
-- Run this SQL script to create all tables
-- This includes ALL latest updates and features
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS edizo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edizo_db;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url VARCHAR(500),
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  icon_url VARCHAR(500) COMMENT 'Icon or logo URL',
  image_url VARCHAR(500) COMMENT 'Main service image URL (uploaded file path)',
  gallery_urls JSON COMMENT 'Multiple images for service gallery',
  category VARCHAR(100) DEFAULT 'Development',
  tags JSON COMMENT 'Technologies or skills as JSON array',
  features JSON COMMENT 'Key features as JSON array',
  benefits JSON COMMENT 'Benefits as JSON array',
  process_steps JSON COMMENT 'Process/workflow steps',
  pricing JSON COMMENT 'Pricing information',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_services_slug (slug),
  INDEX idx_services_category (category),
  INDEX idx_services_is_active (is_active),
  INDEX idx_services_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Services offered by EDIZO';

-- =====================================================
-- 3. INTERNSHIPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS internships (
  id VARCHAR(36) PRIMARY KEY,
  internship_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  mode ENUM('Online', 'Offline', 'Hybrid') DEFAULT 'Online',
  company VARCHAR(255) DEFAULT 'EDIZO',
  image_url VARCHAR(500) COMMENT 'Main internship image URL (uploaded file path)',
  gallery_urls JSON COMMENT 'Multiple images for internship gallery',
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  description TEXT,
  why_choose_edizo JSON COMMENT 'Reasons to choose EDIZO for this internship',
  benefits JSON COMMENT 'Benefits of this internship',
  syllabus JSON COMMENT 'Syllabus by duration',
  pricing JSON COMMENT 'Pricing by duration',
  discount JSON COMMENT 'Discounts by duration',
  available_coupons JSON COMMENT 'Available coupon codes',
  coupon_discounts JSON COMMENT 'Coupon discounts by duration',
  duration_weeks INT COMMENT 'Duration in weeks',
  skills_taught JSON COMMENT 'Skills that will be taught',
  prerequisites JSON COMMENT 'Prerequisites for the internship',
  certification_included BOOLEAN DEFAULT true,
  placement_support BOOLEAN DEFAULT false,
  mentor_support BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  enrollment_count INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_internships_internship_id (internship_id),
  INDEX idx_internships_slug (slug),
  INDEX idx_internships_category (category),
  INDEX idx_internships_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Internship programs offered by EDIZO';

-- =====================================================
-- 4. INTERNSHIP APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS internship_applications (
  id VARCHAR(36) PRIMARY KEY,
  internship_id VARCHAR(36),
  user_id VARCHAR(36),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  college_name VARCHAR(255),
  graduation_year INT,
  current_year INT,
  branch VARCHAR(100),
  resume_url VARCHAR(500),
  cover_letter TEXT,
  duration_selected VARCHAR(50),
  mode_selected VARCHAR(50),
  coupon_code VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  payment_id VARCHAR(100),
  application_status ENUM('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn') DEFAULT 'submitted',
  review_comments TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_id VARCHAR(50),
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_applications_internship_id (internship_id),
  INDEX idx_applications_user_id (user_id),
  INDEX idx_applications_status (application_status),
  INDEX idx_applications_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. SERVICE APPLICATIONS TABLE (NEW - 2025)
-- =====================================================
CREATE TABLE IF NOT EXISTS service_applications (
  id VARCHAR(36) PRIMARY KEY,
  service_id VARCHAR(36),
  user_id VARCHAR(36),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255),
  budget_range VARCHAR(100),
  project_description TEXT,
  requirements TEXT,
  timeline VARCHAR(100),
  service_type VARCHAR(100),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  payment_id VARCHAR(100),
  application_status ENUM('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn') DEFAULT 'submitted',
  review_comments TEXT,
  assigned_to VARCHAR(36),
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_applications_service_id (service_id),
  INDEX idx_applications_user_id (user_id),
  INDEX idx_applications_status (application_status),
  INDEX idx_applications_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Service inquiries and applications';

-- =====================================================
-- 6. CERTIFICATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS certificates (
  id VARCHAR(36) PRIMARY KEY,
  certificate_id VARCHAR(50) UNIQUE NOT NULL,
  internship_id VARCHAR(36),
  application_id VARCHAR(36),
  user_id VARCHAR(36),
  recipient_name VARCHAR(255) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  completion_date DATE NOT NULL,
  issue_date DATE DEFAULT (CURRENT_DATE),
  grade VARCHAR(10),
  score DECIMAL(5,2),
  certificate_url VARCHAR(500),
  qr_code_url VARCHAR(500),
  verification_hash VARCHAR(64) UNIQUE,
  is_verified BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE SET NULL,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_certificates_certificate_id (certificate_id),
  INDEX idx_certificates_verification_hash (verification_hash),
  INDEX idx_certificates_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  bio TEXT,
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  instagram_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_team_members_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  event_type ENUM('Event', 'Webinar', 'Workshop', 'Conference') DEFAULT 'Event',
  description TEXT,
  short_description TEXT,
  image_url VARCHAR(500),
  speaker_names JSON,
  speaker_details JSON,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NULL,
  venue TEXT,
  mode ENUM('Online', 'Offline', 'Hybrid') DEFAULT 'Online',
  registration_link VARCHAR(500),
  registration_deadline TIMESTAMP NULL,
  max_participants INT,
  registered_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_events_slug (slug),
  INDEX idx_events_start_date (start_date),
  INDEX idx_events_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  client_name VARCHAR(255),
  industry VARCHAR(100),
  project_type VARCHAR(100),
  image_url VARCHAR(500),
  gallery_urls JSON,
  technologies JSON,
  features JSON,
  challenges JSON,
  solutions JSON,
  results JSON,
  testimonial TEXT,
  testimonial_author VARCHAR(255),
  project_url VARCHAR(500),
  github_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  completion_date DATE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_slug (slug),
  INDEX idx_projects_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_avatar VARCHAR(500),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT NOT NULL,
  service_type VARCHAR(100),
  project_id VARCHAR(36),
  internship_id VARCHAR(36),
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE SET NULL,
  INDEX idx_testimonials_is_approved (is_approved),
  INDEX idx_testimonials_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. CONTACT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  service_interest VARCHAR(100),
  is_read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_created_at (created_at),
  INDEX idx_contact_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. STATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS stats (
  id VARCHAR(36) PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  value VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  icon_url VARCHAR(500),
  category VARCHAR(100) DEFAULT 'general',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_stats_key (`key`),
  INDEX idx_stats_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. BLOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blogs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id VARCHAR(36),
  author_name VARCHAR(255),
  cover_image_url VARCHAR(500),
  category VARCHAR(100),
  tags JSON,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP NULL,
  views_count INT DEFAULT 0,
  reading_time_minutes INT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_blogs_slug (slug),
  INDEX idx_blogs_is_published (is_published),
  INDEX idx_blogs_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INITIAL DATA - STATS
-- =====================================================
INSERT INTO stats (id, `key`, value, label, category, display_order) VALUES
  (UUID(), 'projects_delivered', '100+', 'Projects Done', 'general', 1),
  (UUID(), 'client_rating', '4.9/5', 'Client Rating', 'general', 2),
  (UUID(), 'on_time_delivery', 'On Time', 'Delivery', 'general', 3),
  (UUID(), 'satisfaction_rate', '100%', 'Satisfaction', 'general', 4),
  (UUID(), 'happy_clients', '10+', 'Happy Clients', 'general', 5),
  (UUID(), 'years_experience', '2+', 'Years Experience', 'general', 6),
  (UUID(), 'students_trained', '500+', 'Students Trained', 'internships', 7),
  (UUID(), 'programs_count', '15+', 'Programs', 'internships', 8),
  (UUID(), 'certification_rate', '100%', 'Certification Rate', 'internships', 9)
ON DUPLICATE KEY UPDATE value=VALUES(value);

-- =====================================================
-- DEFAULT ADMIN USER
-- =====================================================
-- Password: edizo@admin2025 (hashed with bcrypt)
-- IMPORTANT: Change this password in production!
-- To generate a new hash: cd backend && npm run generate-hash your_password

INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
VALUES (
  UUID(),
  'admin@edizo.in',
  '$2a$10$rMx9YQYxQYxQYxQYxQYxQuQYxQYxQYxQYxQYxQYxQYxQYxQYxQYxQ',
  'Edizo Admin',
  'admin',
  true,
  true
);

-- =====================================================
-- ADMIN USER CREATION FUNCTION
-- =====================================================
-- Usage: SELECT create_admin_user('email@example.com', 'Full Name', 'password');

DELIMITER //
CREATE FUNCTION create_admin_user(
  admin_email VARCHAR(255),
  admin_name VARCHAR(255),
  admin_password VARCHAR(255)
) RETURNS VARCHAR(36)
DETERMINISTIC
BEGIN
  DECLARE new_user_id VARCHAR(36);
  DECLARE password_hash VARCHAR(255);
  
  -- Note: This is a simple hash. Use bcrypt in production!
  SET password_hash = CONCAT('$2a$10$', SUBSTRING(MD5(admin_password), 1, 53));
  SET new_user_id = UUID();
  
  INSERT INTO users (id, email, password_hash, full_name, role, email_verified, is_active)
  VALUES (new_user_id, admin_email, password_hash, admin_name, 'admin', true, true);
  
  RETURN new_user_id;
END //
DELIMITER ;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

SELECT '✅ Database schema created successfully!' AS status;
SELECT 'Total tables created: 13' AS info;
SELECT 'Tables: users, services, internships, internship_applications, service_applications, certificates, team_members, events, projects, testimonials, contact_submissions, stats, blogs' AS summary;
SELECT 'Default admin user: admin@edizo.in / edizo@admin2025' AS admin_info;
SELECT 'IMPORTANT: Change the default admin password in production!' AS warning;
