import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all testimonials (public - approved only)
router.get('/', async (req, res) => {
  try {
    const { featured, service_type } = req.query;
    
    let sql = 'SELECT * FROM testimonials WHERE is_approved = true';
    const params = [];
    
    if (featured === 'true') {
      sql += ' AND is_featured = true';
    }
    
    if (service_type) {
      sql += ' AND service_type = ?';
      params.push(service_type);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const testimonials = await query(sql, params);
    res.json({ testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Get all testimonials (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const testimonials = await query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json({ testimonials });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Create testimonial (public with optional auth)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    
    if (!data.customer_name || !data.content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }
    
    const id = uuidv4();
    const userId = req.user?.id || null;
    
    await query(`
      INSERT INTO testimonials (
        id, user_id, customer_name, customer_email, customer_avatar,
        rating, title, content, service_type, project_id, internship_id, is_approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, data.customer_name, data.customer_email, data.customer_avatar,
      data.rating, data.title, data.content, data.service_type, data.project_id,
      data.internship_id, data.is_approved || false
    ]);
    
    res.status(201).json({ message: 'Testimonial submitted successfully. It will be published after approval.', id });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});

// Update testimonial (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const allowedFields = ['is_approved', 'is_featured', 'rating', 'title', 'content'];
    
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
    
    await query(`UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`, params);
    
    res.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// Delete testimonial (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
