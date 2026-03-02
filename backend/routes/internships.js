import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all internships (public)
router.get('/', async (req, res) => {
  try {
    const { category, mode, featured, search, limit } = req.query;
    
    let sql = 'SELECT * FROM internships WHERE is_active = true';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (mode) {
      sql += ' AND mode = ?';
      params.push(mode);
    }
    
    if (featured === 'true') {
      sql += ' AND is_featured = true';
    }
    
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR company LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    sql += ' ORDER BY display_order ASC, created_at DESC';
    
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const internships = await query(sql, params);
    
    res.json({ internships });
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

// Get internship by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const internships = await query('SELECT * FROM internships WHERE (id = ? OR internship_id = ?) AND is_active = true', [req.params.id, req.params.id]);
    
    if (internships.length === 0) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    
    res.json({ internship: internships[0] });
  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({ error: 'Failed to fetch internship' });
  }
});

// Get all internships (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const internships = await query('SELECT * FROM internships ORDER BY display_order ASC, created_at DESC');
    res.json({ internships });
  } catch (error) {
    console.error('Get all internships error:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

// Create internship (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    const internshipId = data.internship_id || `INT-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Helper function to convert undefined or empty string to null
    const val = (v, defaultValue = null) => {
      if (v === undefined || v === null || v === '') return defaultValue;
      return v;
    };

    await query(`
      INSERT INTO internships (
        id, internship_id, title, slug, category, mode, company,
        rating, description,
        why_choose_edizo_1, why_choose_edizo_2, why_choose_edizo_3, why_choose_edizo_4, why_choose_edizo_5, why_choose_edizo_6,
        benefit_1, benefit_2, benefit_3, benefit_4, benefit_5, benefit_6, benefit_7,
        syllabus_15_days, syllabus_1_month, syllabus_2_months, syllabus_3_months,
        price_15_days, price_1_month, price_2_months, price_3_months,
        discount_15_days, discount_1_month, discount_2_months, discount_3_months,
        coupon_code, coupon_discount_15_days, coupon_discount_1_month, coupon_discount_2_months, coupon_discount_3_months,
        duration_weeks, skills_taught, prerequisites, certification_included, placement_support,
        mentor_support, is_active, is_featured, enrollment_count, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      internshipId,
      val(data.title),
      val(slug),
      val(data.category),
      val(data.mode, 'Online'),
      val(data.company, 'EDIZO'),
      val(data.rating, 0),
      val(data.description),
      val(data.why_choose_edizo_1),
      val(data.why_choose_edizo_2),
      val(data.why_choose_edizo_3),
      val(data.why_choose_edizo_4),
      val(data.why_choose_edizo_5),
      val(data.why_choose_edizo_6),
      val(data.benefit_1),
      val(data.benefit_2),
      val(data.benefit_3),
      val(data.benefit_4),
      val(data.benefit_5),
      val(data.benefit_6),
      val(data.benefit_7),
      JSON.stringify(data.syllabus_15_days || []),
      JSON.stringify(data.syllabus_1_month || []),
      JSON.stringify(data.syllabus_2_months || []),
      JSON.stringify(data.syllabus_3_months || []),
      val(data.price_15_days, 0),
      val(data.price_1_month, 0),
      val(data.price_2_months, 0),
      val(data.price_3_months, 0),
      val(data.discount_15_days, 0),
      val(data.discount_1_month, 0),
      val(data.discount_2_months, 0),
      val(data.discount_3_months, 0),
      val(data.coupon_code, 'EDIZOCOP'),
      val(data.coupon_discount_15_days, 0),
      val(data.coupon_discount_1_month, 0),
      val(data.coupon_discount_2_months, 0),
      val(data.coupon_discount_3_months, 0),
      val(data.duration_weeks),
      JSON.stringify(data.skills_taught || []),
      JSON.stringify(data.prerequisites || []),
      val(data.certification_included, true),
      val(data.placement_support, false),
      val(data.mentor_support, true),
      val(data.is_active, true),
      val(data.is_featured, false),
      val(data.enrollment_count, 0),
      val(data.display_order, 0)
    ]);

    res.status(201).json({ message: 'Internship created successfully', id });
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ error: error.message || 'Failed to create internship' });
  }
});

// Update internship (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Helper function to convert undefined or empty string to null
    const val = (v, defaultValue = null) => {
      if (v === undefined || v === null || v === '') return defaultValue;
      return v;
    };

    await query(`
      UPDATE internships SET
        title = ?, slug = ?, category = ?, mode = ?, company = ?, image_url = ?,
        rating = ?, description = ?,
        why_choose_edizo_1 = ?, why_choose_edizo_2 = ?, why_choose_edizo_3 = ?, why_choose_edizo_4 = ?, why_choose_edizo_5 = ?, why_choose_edizo_6 = ?,
        benefit_1 = ?, benefit_2 = ?, benefit_3 = ?, benefit_4 = ?, benefit_5 = ?, benefit_6 = ?, benefit_7 = ?,
        syllabus_15_days = ?, syllabus_1_month = ?, syllabus_2_months = ?, syllabus_3_months = ?,
        price_15_days = ?, price_1_month = ?, price_2_months = ?, price_3_months = ?,
        discount_15_days = ?, discount_1_month = ?, discount_2_months = ?, discount_3_months = ?,
        coupon_code = ?, coupon_discount_15_days = ?, coupon_discount_1_month = ?, coupon_discount_2_months = ?, coupon_discount_3_months = ?,
        duration_weeks = ?, skills_taught = ?, prerequisites = ?, certification_included = ?,
        placement_support = ?, mentor_support = ?, is_active = ?, is_featured = ?,
        enrollment_count = ?, display_order = ?
      WHERE id = ?
    `, [
      val(data.title),
      slug,
      val(data.category),
      val(data.mode),
      val(data.company),
      val(data.image_url),
      val(data.rating, 0),
      val(data.description),
      val(data.why_choose_edizo_1),
      val(data.why_choose_edizo_2),
      val(data.why_choose_edizo_3),
      val(data.why_choose_edizo_4),
      val(data.why_choose_edizo_5),
      val(data.why_choose_edizo_6),
      val(data.benefit_1),
      val(data.benefit_2),
      val(data.benefit_3),
      val(data.benefit_4),
      val(data.benefit_5),
      val(data.benefit_6),
      val(data.benefit_7),
      JSON.stringify(data.syllabus_15_days || []),
      JSON.stringify(data.syllabus_1_month || []),
      JSON.stringify(data.syllabus_2_months || []),
      JSON.stringify(data.syllabus_3_months || []),
      val(data.price_15_days, 0),
      val(data.price_1_month, 0),
      val(data.price_2_months, 0),
      val(data.price_3_months, 0),
      val(data.discount_15_days, 0),
      val(data.discount_1_month, 0),
      val(data.discount_2_months, 0),
      val(data.discount_3_months, 0),
      val(data.coupon_code, 'EDIZOCOP'),
      val(data.coupon_discount_15_days, 0),
      val(data.coupon_discount_1_month, 0),
      val(data.coupon_discount_2_months, 0),
      val(data.coupon_discount_3_months, 0),
      val(data.duration_weeks),
      JSON.stringify(data.skills_taught || []),
      JSON.stringify(data.prerequisites || []),
      val(data.certification_included, true),
      val(data.placement_support, false),
      val(data.mentor_support, true),
      val(data.is_active, true),
      val(data.is_featured, false),
      val(data.enrollment_count, 0),
      val(data.display_order, 0),
      req.params.id
    ]);

    res.json({ message: 'Internship updated successfully' });
  } catch (error) {
    console.error('Update internship error:', error);
    res.status(500).json({ error: error.message || 'Failed to update internship' });
  }
});

// Delete internship (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM internships WHERE id = ?', [req.params.id]);
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({ error: 'Failed to delete internship' });
  }
});

export default router;
