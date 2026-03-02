import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all stats (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let sql = 'SELECT * FROM stats WHERE is_active = true';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    sql += ' ORDER BY display_order ASC';
    
    const stats = await query(sql, params);
    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all stats (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const stats = await query('SELECT * FROM stats ORDER BY display_order ASC');
    res.json({ stats });
  } catch (error) {
    console.error('Get all stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Create stat (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    
    await query(`
      INSERT INTO stats (id, key, value, label, icon_url, category, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.key, data.value, data.label, data.icon_url, data.category || 'general', data.display_order || 0, data.is_active !== false]);
    
    res.status(201).json({ message: 'Stat created successfully', id });
  } catch (error) {
    console.error('Create stat error:', error);
    res.status(500).json({ error: 'Failed to create stat' });
  }
});

// Update stat (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    
    await query(`
      UPDATE stats SET key = ?, value = ?, label = ?, icon_url = ?, category = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `, [data.key, data.value, data.label, data.icon_url, data.category, data.display_order, data.is_active, req.params.id]);
    
    res.json({ message: 'Stat updated successfully' });
  } catch (error) {
    console.error('Update stat error:', error);
    res.status(500).json({ error: 'Failed to update stat' });
  }
});

// Delete stat (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM stats WHERE id = ?', [req.params.id]);
    res.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('Delete stat error:', error);
    res.status(500).json({ error: 'Failed to delete stat' });
  }
});

export default router;
