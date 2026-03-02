import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { featured, industry } = req.query;
    
    let sql = 'SELECT * FROM projects WHERE is_active = true';
    const params = [];
    
    if (featured === 'true') {
      sql += ' AND is_featured = true';
    }
    
    if (industry) {
      sql += ' AND industry = ?';
      params.push(industry);
    }
    
    sql += ' ORDER BY display_order ASC, created_at DESC';
    
    const projects = await query(sql, params);
    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project by ID/slug (public)
router.get('/:id', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects WHERE (id = ? OR slug = ?) AND is_active = true', [req.params.id, req.params.id]);
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ project: projects[0] });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get all projects (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY display_order ASC');
    res.json({ projects });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();

    // Helper function to convert undefined to null
    const val = (v, defaultValue = null) => v !== undefined ? v : defaultValue;

    await query(`
      INSERT INTO projects (
        id, title, slug, short_description, description, client_name, industry,
        project_type, image_url, gallery_urls, technologies, features, challenges,
        solutions, results, testimonial, testimonial_author, project_url, github_url,
        is_active, is_featured, completion_date, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      val(data.title),
      val(data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
      val(data.short_description),
      val(data.description),
      val(data.client_name),
      val(data.industry),
      val(data.project_type),
      val(data.image_url),
      JSON.stringify(data.gallery_urls || []),
      JSON.stringify(data.technologies || []),
      JSON.stringify(data.features || []),
      JSON.stringify(data.challenges || []),
      JSON.stringify(data.solutions || []),
      JSON.stringify(data.results || {}),
      val(data.testimonial),
      val(data.testimonial_author),
      val(data.project_url),
      val(data.github_url),
      val(data.is_active, true),
      val(data.is_featured, false),
      val(data.completion_date),
      val(data.display_order, 0)
    ]);

    res.status(201).json({ message: 'Project created successfully', id });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: error.message || 'Failed to create project' });
  }
});

// Update project (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;

    await query(`
      UPDATE projects SET
        title = ?, slug = ?, short_description = ?, description = ?, client_name = ?,
        industry = ?, project_type = ?, image_url = ?, gallery_urls = ?,
        technologies = ?, features = ?, challenges = ?, solutions = ?, results = ?,
        testimonial = ?, testimonial_author = ?, project_url = ?, github_url = ?,
        is_active = ?, is_featured = ?, completion_date = ?, display_order = ?
      WHERE id = ?
    `, [
      data.title,
      data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      data.short_description,
      data.description,
      data.client_name,
      data.industry,
      data.project_type,
      data.image_url,
      JSON.stringify(data.gallery_urls || []),
      JSON.stringify(data.technologies || []),
      JSON.stringify(data.features || []),
      JSON.stringify(data.challenges || []),
      JSON.stringify(data.solutions || []),
      JSON.stringify(data.results || {}),
      data.testimonial,
      data.testimonial_author,
      data.project_url,
      data.github_url,
      data.is_active,
      data.is_featured,
      data.completion_date,
      data.display_order,
      req.params.id
    ]);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: error.message || 'Failed to update project' });
  }
});

// Delete project (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
