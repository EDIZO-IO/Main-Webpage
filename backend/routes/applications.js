import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all applications (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    console.log('Fetching applications...');
    const { status, type } = req.query;

    let sql = '';
    const params = [];

    if (type === 'service') {
      // Get service applications
      sql = `
        SELECT a.*, s.title as service_title, s.category as service_category
        FROM service_applications a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE 1=1
      `;
    } else {
      // Get internship applications
      sql = `
        SELECT a.*, i.title as internship_title, i.category as internship_category,
               u.full_name as user_name, u.email as user_email
        FROM internship_applications a
        LEFT JOIN internships i ON a.internship_id = i.id
        LEFT JOIN users u ON a.user_id = u.id
        WHERE 1=1
      `;
    }

    if (status) {
      sql += ' AND a.application_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.created_at DESC';

    const applications = await query(sql, params);
    console.log(`Found ${applications.length} applications`);
    res.json({ applications, type });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create internship application (public)
router.post('/internship', async (req, res) => {
  try {
    const data = req.body;

    if (!data.full_name || !data.email || !data.internship_id) {
      return res.status(400).json({ error: 'Full name, email, and internship are required' });
    }

    const id = uuidv4();
    const userId = req.user?.id || null;

    // Helper function to convert undefined to null
    const val = (v, defaultValue = null) => v !== undefined ? v : defaultValue;

    await query(`
      INSERT INTO internship_applications (
        id, internship_id, user_id, full_name, email, phone, college_name,
        graduation_year, current_year, branch, resume_url, cover_letter,
        duration_selected, mode_selected, coupon_code, payment_status,
        payment_amount, application_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      val(data.internship_id),
      userId,
      val(data.full_name),
      val(data.email),
      val(data.phone),
      val(data.college_name),
      val(data.graduation_year),
      val(data.current_year),
      val(data.branch),
      val(data.resume_url),
      val(data.cover_letter),
      val(data.duration_selected),
      val(data.mode_selected),
      val(data.coupon_code),
      val(data.payment_status, 'pending'),
      val(data.payment_amount),
      val(data.application_status, 'submitted')
    ]);

    res.status(201).json({ message: 'Internship application submitted successfully', id });
  } catch (error) {
    console.error('Create internship application error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit internship application' });
  }
});

// Create service application (public)
router.post('/service', async (req, res) => {
  try {
    const data = req.body;

    if (!data.full_name || !data.email || !data.service_id) {
      return res.status(400).json({ error: 'Full name, email, and service are required' });
    }

    const id = uuidv4();
    const userId = req.user?.id || null;

    // Helper function to convert undefined to null
    const val = (v, defaultValue = null) => v !== undefined ? v : defaultValue;

    await query(`
      INSERT INTO service_applications (
        id, service_id, user_id, full_name, email, phone, company_name,
        budget_range, project_description, requirements, timeline, service_type,
        payment_status, payment_amount, application_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      val(data.service_id),
      userId,
      val(data.full_name),
      val(data.email),
      val(data.phone),
      val(data.company_name),
      val(data.budget_range),
      val(data.project_description),
      val(data.requirements),
      val(data.timeline),
      val(data.service_type),
      val(data.payment_status, 'pending'),
      val(data.payment_amount),
      val(data.application_status, 'submitted')
    ]);

    res.status(201).json({ message: 'Service application submitted successfully', id });
  } catch (error) {
    console.error('Create service application error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit service application' });
  }
});

// Update internship application (admin)
router.put('/internship/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const allowedFields = [
      'application_status', 'payment_status', 'payment_amount', 'payment_id',
      'review_comments', 'certificate_issued', 'certificate_id', 'completed_at'
    ];

    const updates = [];
    const params = [];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(req.params.id);

    await query(`UPDATE internship_applications SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ message: 'Internship application updated successfully' });
  } catch (error) {
    console.error('Update internship application error:', error);
    res.status(500).json({ error: error.message || 'Failed to update internship application' });
  }
});

// Update service application (admin)
router.put('/service/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const allowedFields = [
      'application_status', 'payment_status', 'payment_amount', 'payment_id',
      'review_comments', 'assigned_to', 'completed_at'
    ];

    const updates = [];
    const params = [];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(req.params.id);

    await query(`UPDATE service_applications SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ message: 'Service application updated successfully' });
  } catch (error) {
    console.error('Update service application error:', error);
    res.status(500).json({ error: error.message || 'Failed to update service application' });
  }
});

// Delete internship application (admin)
router.delete('/internship/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM internship_applications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Internship application deleted successfully' });
  } catch (error) {
    console.error('Delete internship application error:', error);
    res.status(500).json({ error: 'Failed to delete internship application' });
  }
});

// Delete service application (admin)
router.delete('/service/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM service_applications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service application deleted successfully' });
  } catch (error) {
    console.error('Delete service application error:', error);
    res.status(500).json({ error: 'Failed to delete service application' });
  }
});

export default router;
