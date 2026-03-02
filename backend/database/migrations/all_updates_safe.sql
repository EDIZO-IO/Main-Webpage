-- =====================================================
-- EDIZO Database Migration - Safe Version
-- =====================================================
-- Run this on EXISTING databases to add all new features
-- This version checks for existing columns before adding
-- =====================================================

USE edizo_db;

-- =====================================================
-- 1. ADD IMAGE UPLOAD SUPPORT
-- =====================================================

-- Add gallery_urls to services table (only if not exists)
SET @dbname = DATABASE();
SET @tablename = 'services';
SET @columnname = 'gallery_urls';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' JSON COMMENT \'Multiple images for service gallery\' AFTER image_url')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add gallery_urls to internships table (only if not exists)
SET @tablename = 'internships';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' JSON COMMENT \'Multiple images for internship gallery\' AFTER image_url')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update comments for services table
ALTER TABLE services 
MODIFY COLUMN icon_url VARCHAR(500) COMMENT 'Icon or logo URL',
MODIFY COLUMN image_url VARCHAR(500) COMMENT 'Main service image URL (uploaded file path)';

-- Update comments for internships table
ALTER TABLE internships 
MODIFY COLUMN image_url VARCHAR(500) COMMENT 'Main internship image URL (uploaded file path)';

-- =====================================================
-- 2. ADD PROJECTS TABLE (if not exists)
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
-- 3. ADD/UPDATE TESTIMONIALS TABLE
-- =====================================================

-- Add is_approved column (only if not exists)
SET @columnname = 'is_approved';
SET @tablename = 'testimonials';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT false AFTER service_type')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add is_featured column (only if not exists)
SET @columnname = 'is_featured';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT false AFTER is_approved')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add indexes for performance
ALTER TABLE testimonials ADD INDEX idx_testimonials_is_approved (is_approved);
ALTER TABLE testimonials ADD INDEX idx_testimonials_rating (rating);

-- =====================================================
-- 4. ADD/UPDATE EVENTS TABLE
-- =====================================================

-- Add event_type column (only if not exists)
SET @columnname = 'event_type';
SET @tablename = 'events';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ENUM(\'Event\', \'Webinar\', \'Workshop\', \'Conference\') DEFAULT \'Event\' AFTER slug')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add is_featured column (only if not exists)
SET @columnname = 'is_featured';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT false AFTER is_active')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add short_description (only if not exists)
SET @columnname = 'short_description';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT AFTER description')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- =====================================================
-- 5. ADD/UPDATE STATS TABLE
-- =====================================================

-- Ensure stats table has all required fields
INSERT INTO stats (`key`, value, label, category, display_order) VALUES
  ('projects_delivered', '100+', 'Projects Done', 'general', 1),
  ('client_rating', '4.9/5', 'Client Rating', 'general', 2),
  ('on_time_delivery', 'On Time', 'Delivery', 'general', 3),
  ('satisfaction_rate', '100%', 'Satisfaction', 'general', 4),
  ('happy_clients', '10+', 'Happy Clients', 'general', 5),
  ('years_experience', '2+', 'Years Experience', 'general', 6),
  ('students_trained', '500+', 'Students Trained', 'internships', 7),
  ('programs_count', '15+', 'Programs', 'internships', 8),
  ('certification_rate', '100%', 'Certification Rate', 'internships', 9)
ON DUPLICATE KEY UPDATE value=VALUES(value);

-- =====================================================
-- 6. VERIFY ALL TABLES
-- =====================================================

SELECT 'Verifying tables...' AS status;

-- Check if all tables exist
SELECT 
  TABLE_NAME,
  TABLE_COMMENT
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'edizo_db'
  AND TABLE_NAME IN (
    'users',
    'services',
    'internships',
    'internship_applications',
    'certificates',
    'team_members',
    'events',
    'projects',
    'testimonials',
    'contact_submissions',
    'stats',
    'blogs'
  )
ORDER BY TABLE_NAME;

-- =====================================================
-- 7. VERIFY COLUMNS
-- =====================================================

SELECT 'Services table columns:' AS info;
SHOW COLUMNS FROM services LIKE '%image%';

SELECT 'Internships table columns:' AS info;
SHOW COLUMNS FROM internships LIKE '%image%';

SELECT 'Projects table columns:' AS info;
SHOW COLUMNS FROM projects LIKE '%image%';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

SELECT '✅ Migration completed successfully!' AS status;
SELECT 'All tables updated with image upload support' AS info;
SELECT 'Run this command to verify:' AS info;
SELECT 'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = "edizo_db";' AS sql_command;
