import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.email || !data.message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const id = uuidv4();

    // Helper function to convert undefined to null
    const val = (v, defaultValue = null) => v !== undefined ? v : defaultValue;

    await query(`
      INSERT INTO contact_submissions (
        id, name, email, phone, subject, message, service_interest
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      val(data.name),
      val(data.email),
      val(data.phone),
      val(data.subject),
      val(data.message),
      val(data.service_interest)
    ]);

    res.status(201).json({ message: 'Message sent successfully. We will get back to you soon!' });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
});

// Get all contact submissions (admin)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { is_read, replied } = req.query;

    let sql = 'SELECT * FROM contact_submissions';
    const params = [];

    if (is_read !== undefined) {
      sql += ' WHERE is_read = ?';
      params.push(is_read === 'true');
    }

    sql += ' ORDER BY created_at DESC';

    const submissions = await query(sql, params);
    res.json({ submissions });
  } catch (error) {
    console.error('Get contact submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Update contact submission (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const allowedFields = ['is_read', 'replied', 'admin_notes'];

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

    await query(`UPDATE contact_submissions SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ message: 'Contact submission updated successfully' });
  } catch (error) {
    console.error('Update contact submission error:', error);
    res.status(500).json({ error: error.message || 'Failed to update contact submission' });
  }
});

// Delete contact submission (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM contact_submissions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Delete contact submission error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete contact submission' });
  }
});

export default router;
