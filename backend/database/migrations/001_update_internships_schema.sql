-- =====================================================
-- EDIZO Internships Table Migration
-- Date: 2026-03-02
-- Description: Drop and recreate internships table with updated schema
--              based on new spreadsheet data structure
-- =====================================================

USE edizo_db;

-- =====================================================
-- Drop existing tables (WARNING: This will delete all data)
-- =====================================================
-- Disable foreign key checks to allow dropping tables with dependencies
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS internship_applications;
DROP TABLE IF EXISTS internships;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- Recreate INTERNSHIPS TABLE with updated schema
-- =====================================================
CREATE TABLE internships (
  id VARCHAR(36) PRIMARY KEY,
  internship_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  mode ENUM('Online', 'Offline', 'Hybrid') DEFAULT 'Online',
  company VARCHAR(255) DEFAULT 'EDIZO',
  image_url VARCHAR(500) COMMENT 'Main internship image URL',
  rating DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Rating out of 5',
  description TEXT,
  
  -- Why Choose Edizo (6 items as per spreadsheet)
  why_choose_edizo_1 VARCHAR(500),
  why_choose_edizo_2 VARCHAR(500),
  why_choose_edizo_3 VARCHAR(500),
  why_choose_edizo_4 VARCHAR(500),
  why_choose_edizo_5 VARCHAR(500),
  why_choose_edizo_6 VARCHAR(500),
  
  -- Benefits (7 items with some gaps as per spreadsheet)
  benefit_1 VARCHAR(500),
  benefit_2 VARCHAR(500),
  benefit_3 VARCHAR(500),
  benefit_4 VARCHAR(500),
  benefit_5 VARCHAR(500),
  benefit_6 VARCHAR(500),
  benefit_7 VARCHAR(500),
  
  -- Syllabus by duration (stored as JSON arrays)
  syllabus_15_days JSON COMMENT 'Syllabus for 15 days',
  syllabus_1_month JSON COMMENT 'Syllabus for 1 month',
  syllabus_2_months JSON COMMENT 'Syllabus for 2 months',
  syllabus_3_months JSON COMMENT 'Syllabus for 3 months',
  
  -- Pricing by duration
  price_15_days DECIMAL(10,2) DEFAULT 0,
  price_1_month DECIMAL(10,2) DEFAULT 0,
  price_2_months DECIMAL(10,2) DEFAULT 0,
  price_3_months DECIMAL(10,2) DEFAULT 0,
  
  -- Discount by duration (percentage)
  discount_15_days DECIMAL(5,2) DEFAULT 0,
  discount_1_month DECIMAL(5,2) DEFAULT 0,
  discount_2_months DECIMAL(5,2) DEFAULT 0,
  discount_3_months DECIMAL(5,2) DEFAULT 0,
  
  -- Coupon information
  coupon_code VARCHAR(50) DEFAULT 'EDIZOCOP',
  coupon_discount_15_days DECIMAL(5,2) DEFAULT 0,
  coupon_discount_1_month DECIMAL(5,2) DEFAULT 0,
  coupon_discount_2_months DECIMAL(5,2) DEFAULT 0,
  coupon_discount_3_months DECIMAL(5,2) DEFAULT 0,
  
  -- Additional fields
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
-- Recreate INTERNSHIP APPLICATIONS TABLE
-- =====================================================
CREATE TABLE internship_applications (
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
-- Insert initial internship data from spreadsheet (17 programs)
-- =====================================================

-- 1. UI/UX Design
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'ui-ux-design', 'UI/UX Design', 'ui-ux-design', 'Design', 'Online', 'EDIZO', 'assets/images/web-design.png', 4.6,
  'Work alongside our design team to create beautiful, intuitive user interfaces and improve user experiences.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 2. Frontend Development
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'frontend-development', 'Frontend Development', 'frontend-development', 'Development', 'Online', 'EDIZO', '/assets/images/responsive-design.png', 4.2,
  'Gain hands-on experience in building responsive and interactive user interfaces using HTML, CSS, JavaScript, and modern frameworks like React.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 3. Backend Development
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'backend-development', 'Backend Development', 'backend-development', 'Development', 'Online', 'EDIZO', '/assets/images/back-end.png', 4.3,
  'Understand server-side technologies like Node.js, Express, and databases such as MySQL or MongoDB.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1599, 2599, 3999, 5599, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 4. HR Management
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'hr-management', 'HR Management', 'hr-management', 'HR', 'Online', 'EDIZO', '/assets/images/hr-manager.png', 4.2,
  'Understand core HR functions such as recruitment, payroll, training, performance evaluation, and employee engagement.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 5. Data Analytics
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'data-analytics', 'Data Analytics', 'data-analytics', 'Data Science', 'Online', 'EDIZO', '/assets/images/data-Analystics.png', 4.1,
  'Gain proficiency in tools like Excel, Power BI, and Python for data cleaning, visualization, and reporting.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 6. Java Development
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'java-development', 'Java Development', 'java-development', 'Java', 'Online', 'EDIZO', '/assets/images/java.png', 4.4,
  'Build a solid understanding of Java fundamentals, OOP concepts, and project structures using Eclipse or IntelliJ.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 7. Python Programming
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'python-development', 'Python Programming', 'python-development', 'Python', 'Online', 'EDIZO', '/assets/images/python.png', 4.8,
  'Master Python from basics to advanced concepts with real-time projects involving automation, web scraping, and problem-solving.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1699, 2699, 4199, 5699, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 8. Digital Marketing
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'digital-marketing', 'Digital Marketing', 'digital-marketing', 'Marketing', 'Online', 'EDIZO', '/assets/images/content-strategy.png', 4.7,
  'Explore SEO, social media strategy, content marketing, Google Ads, and analytics tools for building brand presence.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 9. AI & Machine Learning
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'ai-ml', 'AI & Machine Learning', 'ai-ml', 'AI/ML', 'Online', 'EDIZO', '/assets/images/ai-assistant.png', 4.9,
  'Delve into intelligent systems by learning machine learning algorithms, model building, and deployment using Python libraries.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 10. Prompt Engineering
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'prompt-engineering', 'Prompt Engineering', 'prompt-engineering', 'AI/ML', 'Online', 'EDIZO', '/assets/images/AI with CHATGPT.png', 4.8,
  'Explore natural language processing, chatbot development, and prompt engineering using GPT-based models.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 11. Web Development
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'web-development', 'Web Development', 'web-development', 'Development', 'Online', 'EDIZO', '/assets/images/web-development.png', 4.3,
  'Get full-stack exposure by combining front-end and back-end skills. Build and deploy complete websites and web applications.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 12. C-Sharp
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'csharp', 'C-Sharp', 'csharp', 'C#', 'Online', 'EDIZO', '/assets/images/c-sharp.png', 4.3,
  'Learn fundamental syntax, object-oriented programming concepts, and .NET framework fundamentals using C# and related libraries.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 13. Python for Data Science
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'python-data-science', 'Python for Data Science', 'python-data-science', 'Python', 'Online', 'EDIZO', '/assets/images/python.png', 4.4,
  'Learn Python for data science with NumPy, Pandas, Matplotlib, and real-world data analysis projects. Master data cleaning, visualization, and statistical analysis.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 14. Python Web Development with Django
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'python-django', 'Python Web Development with Django', 'python-django', 'Python', 'Online', 'EDIZO', '/assets/images/python.png', 4.8,
  'Build powerful web applications using Python Django framework. Learn MVT architecture, REST APIs, authentication, and deployment to production servers.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 15. Python Automation & Scripting
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'python-automation', 'Python Automation & Scripting', 'python-automation', 'Python', 'Online', 'EDIZO', '/assets/images/python.png', 4.6,
  'Master Python automation for web scraping, task automation, file handling, and process optimization. Learn Selenium, BeautifulSoup, and scheduling.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- 16. Python Machine Learning
INSERT INTO internships (
  id, internship_id, title, slug, category, mode, company, image_url, rating, description,
  why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
  benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
  price_15_days, price_1_month, price_2_months, price_3_months,
  discount_15_days, discount_1_month, discount_2_months, discount_3_months,
  coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months
) VALUES (
  UUID(), 'python-machine-learning', 'Python Machine Learning', 'python-machine-learning', 'Python', 'Online', 'EDIZO', '/assets/images/python.png', 4.3,
  'Dive into Machine Learning with Python. Learn algorithms, model training, neural networks, and deploy ML models in production with TensorFlow and Scikit-learn.',
  '100% Internship Certification', 'Real-Time, Hands-On Project for Each Course', 'Learn from Experienced Industry Mentors',
  'Placement Guidance & Portfolio Support', 'Paid Internship Opportunities', 'Gain In-Demand Industry Skills',
  'Build Strong Resume with Real-Time Projects', 'Internship Certificate Recognized by Companies', 'Boost Confidence for Interviews & Job Roles',
  'Get Exposure to Professional Tools & Platforms', NULL, NULL, NULL,
  1499, 2499, 3999, 5499, 0, 0, 0, 0, 'EDIZOCOP', 0, 0, 0, 0
);

-- =====================================================
-- Verification Queries
-- =====================================================
SELECT '✅ Internships table migration completed successfully!' AS status;
SELECT COUNT(*) AS total_internships FROM internships;
SELECT internship_id, title, category, price_1_month, rating FROM internships ORDER BY display_order, created_at;
