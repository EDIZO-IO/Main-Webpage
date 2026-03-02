-- =====================================================
-- Run this in MySQL Workbench to create service applications table
-- =====================================================

USE edizo_db;

-- Create service applications table
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

SELECT '✅ Service applications table created successfully!' AS status;
