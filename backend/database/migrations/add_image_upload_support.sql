-- =====================================================
-- EDIZO Database - Image Upload Support Migration
-- =====================================================
-- Run this to add image upload support to existing database
-- =====================================================

USE edizo_db;

-- Add gallery_urls column to services table
ALTER TABLE services 
ADD COLUMN gallery_urls JSON COMMENT 'Multiple images for service gallery' AFTER image_url;

-- Add gallery_urls column to internships table
ALTER TABLE internships 
ADD COLUMN gallery_urls JSON COMMENT 'Multiple images for internship gallery' AFTER image_url;

-- Add comments to existing columns for documentation
ALTER TABLE services 
MODIFY COLUMN icon_url VARCHAR(500) COMMENT 'Icon or logo URL',
MODIFY COLUMN image_url VARCHAR(500) COMMENT 'Main service image URL (uploaded file path)',
MODIFY COLUMN tags JSON COMMENT 'Technologies or skills as JSON array',
MODIFY COLUMN features JSON COMMENT 'Key features as JSON array',
MODIFY COLUMN benefits JSON COMMENT 'Benefits as JSON array';

ALTER TABLE internships 
MODIFY COLUMN image_url VARCHAR(500) COMMENT 'Main internship image URL (uploaded file path)',
MODIFY COLUMN why_choose_edizo JSON COMMENT 'Reasons to choose EDIZO for this internship',
MODIFY COLUMN benefits JSON COMMENT 'Benefits of this internship',
MODIFY COLUMN syllabus JSON COMMENT 'Syllabus by duration',
MODIFY COLUMN pricing JSON COMMENT 'Pricing by duration';

-- Add table comments
ALTER TABLE services COMMENT = 'Services offered by EDIZO';
ALTER TABLE internships COMMENT = 'Internship programs offered by EDIZO';

-- Verify changes
SHOW COLUMNS FROM services;
SHOW COLUMNS FROM internships;

SELECT 'Migration completed successfully!' AS status;
