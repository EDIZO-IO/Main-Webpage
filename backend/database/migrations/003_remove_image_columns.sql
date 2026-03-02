-- =====================================================
-- EDIZO Remove Image Columns Migration
-- Date: 2026-03-02
-- Description: Remove all image_url columns from services 
--              and internships tables to simplify the schema
--              and redesign pages without images
-- =====================================================

USE edizo_db;

-- =====================================================
-- Step 1: Remove image_url from services table
-- =====================================================
ALTER TABLE services
DROP COLUMN image_url;

-- Also remove icon_url if it exists (for consistency)
ALTER TABLE services
DROP COLUMN IF EXISTS icon_url;

-- =====================================================
-- Step 2: Remove image_url from internships table
-- =====================================================
ALTER TABLE internships
DROP COLUMN image_url;

-- =====================================================
-- Step 3: Update existing services data
-- Remove image paths from INSERT statements or UPDATE existing records
-- =====================================================
-- Update services to remove any image references in data
UPDATE services 
SET description = COALESCE(description, '')
WHERE description IS NOT NULL;

-- =====================================================
-- Step 4: Update existing internships data
-- =====================================================
UPDATE internships 
SET description = COALESCE(description, '')
WHERE description IS NOT NULL;

-- =====================================================
-- Verification Queries
-- =====================================================
SELECT '✅ Image columns removed successfully!' AS status;

-- Verify services table structure
SELECT 
  COLUMN_NAME, 
  DATA_TYPE, 
  COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'edizo_db' 
  AND TABLE_NAME = 'services' 
  AND COLUMN_NAME NOT LIKE 'image%' 
  AND COLUMN_NAME NOT LIKE 'icon%'
ORDER BY ORDINAL_POSITION;

-- Verify internships table structure
SELECT 
  COLUMN_NAME, 
  DATA_TYPE, 
  COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'edizo_db' 
  AND TABLE_NAME = 'internships' 
  AND COLUMN_NAME NOT LIKE 'image%'
ORDER BY ORDINAL_POSITION;

-- Count affected tables
SELECT 
  (SELECT COUNT(*) FROM services) AS total_services,
  (SELECT COUNT(*) FROM internships) AS total_internships;
