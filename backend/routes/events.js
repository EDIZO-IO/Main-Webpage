import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const { type, upcoming } = req.query;
    
    let sql = 'SELECT * FROM events WHERE is_active = true';
    const params = [];
    
    if (type) {
      sql += ' AND event_type = ?';
      params.push(type);
    }
    
    if (upcoming === 'true') {
      sql += ' AND start_date > NOW()';
    }
    
    sql += ' ORDER BY start_date ASC';
    
    const events = await query(sql, params);
    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID/slug (public)
router.get('/:id', async (req, res) => {
  try {
    const events = await query('SELECT * FROM events WHERE (id = ? OR slug = ?) AND is_active = true', [req.params.id, req.params.id]);
    
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ event: events[0] });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Get all events (admin)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const events = await query('SELECT * FROM events ORDER BY start_date ASC');
    res.json({ events });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create event (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();

    // Helper function to convert undefined or empty string to null
    const val = (v, defaultValue = null) => {
      if (v === undefined || v === null || v === '') return defaultValue;
      return v;
    };

    await query(`
      INSERT INTO events (
        id, title, slug, event_type, description, short_description, image_url,
        speaker_names, speaker_details, start_date, end_date, venue, mode,
        registration_link, registration_deadline, max_participants, registered_count,
        is_active, is_featured, meta_title, meta_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      val(data.title),
      val(data.slug),
      val(data.event_type, 'Event'),
      val(data.description),
      val(data.short_description),
      val(data.image_url),
      JSON.stringify(data.speaker_names || []),
      JSON.stringify(data.speaker_details || {}),
      val(data.start_date),
      val(data.end_date),
      val(data.venue),
      val(data.mode, 'Online'),
      val(data.registration_link),
      val(data.registration_deadline),
      val(data.max_participants),
      val(data.registered_count, 0),
      val(data.is_active, true),
      val(data.is_featured, false),
      val(data.meta_title),
      val(data.meta_description)
    ]);

    res.status(201).json({ message: 'Event created successfully', id });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
});

// Update event (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;

    // Helper function to convert undefined or empty string to null
    const val = (v, defaultValue = null) => {
      if (v === undefined || v === null || v === '') return defaultValue;
      return v;
    };

    await query(`
      UPDATE events SET
        title = ?, slug = ?, event_type = ?, description = ?, short_description = ?,
        image_url = ?, speaker_names = ?, speaker_details = ?, start_date = ?,
        end_date = ?, venue = ?, mode = ?, registration_link = ?,
        registration_deadline = ?, max_participants = ?, registered_count = ?,
        is_active = ?, is_featured = ?, meta_title = ?, meta_description = ?
      WHERE id = ?
    `, [
      val(data.title),
      val(data.slug),
      val(data.event_type),
      val(data.description),
      val(data.short_description),
      val(data.image_url),
      JSON.stringify(data.speaker_names || []),
      JSON.stringify(data.speaker_details || {}),
      val(data.start_date),
      val(data.end_date),
      val(data.venue),
      val(data.mode),
      val(data.registration_link),
      val(data.registration_deadline),
      val(data.max_participants),
      val(data.registered_count, 0),
      val(data.is_active, true),
      val(data.is_featured, false),
      val(data.meta_title),
      val(data.meta_description),
      req.params.id
    ]);

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: error.message || 'Failed to update event' });
  }
});

// Delete event (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
