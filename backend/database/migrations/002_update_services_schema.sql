-- =====================================================
-- EDIZO Services Table Update
-- Date: 2026-03-02
-- Description: Add subtitle and cta_text fields to services table
--              Insert 8 services from spreadsheet data
-- =====================================================

USE edizo_db;

-- =====================================================
-- Add new columns to services table
-- =====================================================
ALTER TABLE services 
ADD COLUMN subtitle VARCHAR(255) AFTER title,
ADD COLUMN cta_text VARCHAR(100) AFTER image_url;

-- =====================================================
-- Insert services data from spreadsheet
-- =====================================================

-- 1. Web Development
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'Web Development', 
  'web-development',
  'Scalable & High-Performance Websites',
  'Build blazing-fast, responsive websites with React, Next.js, and modern web technologies. We create custom web solutions that drive results.',
  '/assets/services/website-design.webp',
  JSON_ARRAY('Responsive Design', 'SEO Optimization', 'Performance Tuning'),
  JSON_ARRAY('React', 'Next.js', 'Node.js'),
  'Build Your Dream Website',
  'Development',
  true,
  true,
  1
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 2. UI/UX Design
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'UI/UX Design', 
  'ui-ux',
  'User-Centered Digital Experiences',
  'Design interfaces that are beautiful, intuitive, and drive conversions. We create user experiences that delight and engage.',
  '/assets/services/uiux.webp',
  JSON_ARRAY('User Research & Personas', 'Wireframing & Prototyping', 'Visual Design (UI)'),
  JSON_ARRAY('Figma', 'Sketch', 'Adobe XD'),
  'Design Better Experiences',
  'Design',
  true,
  true,
  2
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 3. App Development
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'App Development', 
  'app-development',
  'Cross-Platform Mobile Solutions',
  'Build powerful iOS & Android apps with React Native & Flutter. We create mobile experiences that users love.',
  '/assets/services/app-design.webp',
  JSON_ARRAY('Cross-Platform Development', 'Native Performance', 'Push Notifications'),
  JSON_ARRAY('React Native', 'Flutter', 'Swift'),
  'Launch Your App Idea',
  'Development',
  true,
  true,
  3
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 4. Video Editing
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'Video Editing', 
  'video-editing',
  'Engaging Visual Storytelling',
  'Transform raw footage into compelling videos for marketing & branding. Professional editing that tells your story.',
  '/assets/services/video-editing.webp',
  JSON_ARRAY('Color Grading & Correction', 'Motion Graphics & Animation', 'Sound Design & Mixing'),
  JSON_ARRAY('Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'),
  'Tell Your Story Visually',
  'Media',
  true,
  false,
  4
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. Graphic Design
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'Graphic Design', 
  'graphic-design',
  'Visual Identity & Branding',
  'Craft stunning visuals that elevate your brand and communicate effectively. From logos to complete brand systems.',
  '/assets/services/graphic-design.webp',
  JSON_ARRAY('Logo & Brand Identity', 'Marketing Collateral', 'Social Media Graphics'),
  JSON_ARRAY('Adobe Photoshop', 'Illustrator', 'InDesign'),
  'Elevate Your Brand Visually',
  'Design',
  true,
  false,
  5
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. API Development
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'API Development', 
  'api-development',
  'Seamless Integration & Data Flow',
  'Build robust, scalable APIs to connect your applications and services. Secure, documented, and performant.',
  '/assets/services/api-development.webp',
  JSON_ARRAY('RESTful & GraphQL APIs', 'Auth & Authorization', 'Rate Limiting & Throttling'),
  JSON_ARRAY('Node.js', 'Express', 'Python'),
  'Connect Your Systems',
  'Development',
  true,
  false,
  6
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 7. SEO Optimization
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'SEO Optimization', 
  'seo',
  'Dominate Search Engine Rankings',
  'Drive organic traffic and grow your online presence with SEO strategies. Data-driven optimization that delivers results.',
  '/assets/services/seo.webp',
  JSON_ARRAY('Technical SEO Audit', 'Keyword Research & Strategy', 'On-Page Optimization'),
  JSON_ARRAY('Google Analytics', 'Google Search Console', 'SEMrush'),
  'Rank Higher on Google',
  'Marketing',
  true,
  false,
  7
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 8. Digital Marketing
INSERT INTO services (
  id, title, slug, subtitle, description, image_url,
  features, tags, cta_text, category, is_active, is_featured, display_order
) VALUES (
  UUID(), 
  'Digital Marketing', 
  'digital-marketing',
  'Reach & Engage Your Audience',
  'Comprehensive online marketing strategies to grow your brand and business. Multi-channel campaigns that convert.',
  '/assets/services/digital-marketing.webp',
  JSON_ARRAY('SEM/PPC', 'Social Media Marketing', 'Email Marketing Campaigns'),
  JSON_ARRAY('Google Ads', 'Meta Ads Manager', 'Mailchimp'),
  'Boost Your Online Presence',
  'Marketing',
  true,
  false,
  8
) ON DUPLICATE KEY UPDATE title=VALUES(title);

-- =====================================================
-- Verification
-- =====================================================
SELECT '✅ Services table updated successfully!' AS status;
SELECT COUNT(*) AS total_services FROM services;
SELECT title, subtitle, cta_text, category FROM services ORDER BY display_order;
