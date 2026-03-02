import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const members = await query('SELECT * FROM team_members WHERE is_active = true ORDER BY display_order ASC');
    res.json({ team_members: members });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get all team members (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const members = await query('SELECT * FROM team_members ORDER BY display_order ASC');
    res.json({ team_members: members });
  } catch (error) {
    console.error('Get all team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Create team member (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    
    await query(`
      INSERT INTO team_members (
        id, name, role, photo_url, email, phone, bio,
        linkedin_url, twitter_url, instagram_url, is_active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.name, data.role, data.photo_url, data.email, data.phone,
      data.bio, data.linkedin_url, data.twitter_url, data.instagram_url,
      data.is_active !== false, data.display_order || 0
    ]);
    
    res.status(201).json({ message: 'Team member created successfully', id });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update team member (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    
    await query(`
      UPDATE team_members SET
        name = ?, role = ?, photo_url = ?, email = ?, phone = ?, bio = ?,
        linkedin_url = ?, twitter_url = ?, instagram_url = ?,
        is_active = ?, display_order = ?
      WHERE id = ?
    `, [
      data.name, data.role, data.photo_url, data.email, data.phone, data.bio,
      data.linkedin_url, data.twitter_url, data.instagram_url,
      data.is_active, data.display_order, req.params.id
    ]);
    
    res.json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Delete team member (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM team_members WHERE id = ?', [req.params.id]);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;
