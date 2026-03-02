import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let sql = 'SELECT * FROM services WHERE is_active = true';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (featured === 'true') {
      sql += ' AND is_featured = true';
    }
    
    sql += ' ORDER BY display_order ASC, created_at DESC';
    
    const services = await query(sql, params);
    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID/slug (public)
router.get('/:id', async (req, res) => {
  try {
    const services = await query('SELECT * FROM services WHERE (id = ? OR slug = ?) AND is_active = true', [req.params.id, req.params.id]);
    
    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service: services[0] });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Get all services (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const services = await query('SELECT * FROM services ORDER BY display_order ASC');
    res.json({ services });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Create service (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Helper function to convert undefined or empty string to null
    const val = (v, defaultValue = null) => {
      if (v === undefined || v === null || v === '') return defaultValue;
      return v;
    };

    await query(`
      INSERT INTO services (
        id, title, slug, subtitle, short_description, description,
        category, tags, features, benefits, process_steps, pricing, cta_text,
        is_active, is_featured, display_order, meta_title, meta_description, gallery_urls
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      val(data.title),
      val(slug),
      val(data.subtitle),
      val(data.short_description),
      val(data.description),
      val(data.category, 'Development'),
      JSON.stringify(data.tags || []),
      JSON.stringify(data.features || []),
      JSON.stringify(data.benefits || []),
      JSON.stringify(data.process_steps || {}),
      JSON.stringify(data.pricing || {}),
      val(data.cta_text, 'Learn More'),
      val(data.is_active, true),
      val(data.is_featured, false),
      val(data.display_order, 0),
      val(data.meta_title),
      val(data.meta_description),
      JSON.stringify(data.gallery_urls || [])
    ]);

    res.status(201).json({ message: 'Service created successfully', id });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: error.message || 'Failed to create service' });
  }
});

// Update service (admin)
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
      UPDATE services SET
        title = ?, slug = ?, subtitle = ?, short_description = ?, description = ?, category = ?, tags = ?, features = ?, benefits = ?,
        process_steps = ?, pricing = ?, cta_text = ?, is_active = ?, is_featured = ?,
        display_order = ?, meta_title = ?, meta_description = ?, gallery_urls = ?
      WHERE id = ?
    `, [
      val(data.title),
      val(slug),
      val(data.subtitle),
      val(data.short_description),
      val(data.description),
      val(data.category),
      JSON.stringify(data.tags || []),
      JSON.stringify(data.features || []),
      JSON.stringify(data.benefits || []),
      JSON.stringify(data.process_steps || {}),
      JSON.stringify(data.pricing || {}),
      val(data.cta_text, 'Learn More'),
      val(data.is_active, true),
      val(data.is_featured, false),
      val(data.display_order, 0),
      val(data.meta_title),
      val(data.meta_description),
      JSON.stringify(data.gallery_urls || []),
      req.params.id
    ]);

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: error.message || 'Failed to update service' });
  }
});

// Delete service (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
