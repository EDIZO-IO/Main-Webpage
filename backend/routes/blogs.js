import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all blogs (public - published only)
router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    
    let sql = 'SELECT * FROM blogs WHERE is_published = true ORDER BY published_at DESC';
    const params = [];
    
    if (category) {
      sql = 'SELECT * FROM blogs WHERE is_published = true AND category = ? ORDER BY published_at DESC';
      params.push(category);
    }
    
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const blogs = await query(sql, params);
    res.json({ blogs });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get blog by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    // Increment view count
    await query('UPDATE blogs SET views_count = views_count + 1 WHERE slug = ?', [req.params.slug]);
    
    const blogs = await query('SELECT * FROM blogs WHERE slug = ? AND is_published = true', [req.params.slug]);
    
    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json({ blog: blogs[0] });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Get all blogs (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const blogs = await query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json({ blogs });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Create blog (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    const publishedAt = data.is_published ? new Date().toISOString() : null;
    
    await query(`
      INSERT INTO blogs (
        id, title, slug, excerpt, content, author_id, author_name, cover_image_url,
        category, tags, is_published, published_at, views_count, reading_time_minutes,
        meta_title, meta_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.title, data.slug, data.excerpt, data.content, data.author_id,
      data.author_name, data.cover_image_url, data.category,
      JSON.stringify(data.tags || []), data.is_published || false, publishedAt,
      0, data.reading_time_minutes, data.meta_title, data.meta_description
    ]);
    
    res.status(201).json({ message: 'Blog created successfully', id });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Update blog (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    
    await query(`
      UPDATE blogs SET
        title = ?, slug = ?, excerpt = ?, content = ?, author_name = ?,
        cover_image_url = ?, category = ?, tags = ?, is_published = ?,
        published_at = ?, reading_time_minutes = ?, meta_title = ?, meta_description = ?
      WHERE id = ?
    `, [
      data.title, data.slug, data.excerpt, data.content, data.author_name,
      data.cover_image_url, data.category, JSON.stringify(data.tags || []),
      data.is_published, data.is_published ? new Date().toISOString() : null,
      data.reading_time_minutes, data.meta_title, data.meta_description, req.params.id
    ]);
    
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
