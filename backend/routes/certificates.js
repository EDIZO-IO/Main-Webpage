import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Verify certificate (public)
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const certs = await query(`
      SELECT c.*, i.title as internship_title
      FROM certificates c
      LEFT JOIN internships i ON c.internship_id = i.id
      WHERE c.certificate_id = ? AND c.is_verified = true AND c.is_active = true
    `, [req.params.certificateId]);
    
    if (certs.length === 0) {
      return res.status(404).json({ valid: false, message: 'Certificate not found or invalid' });
    }
    
    res.json({ valid: true, certificate: certs[0] });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

// Get all certificates (admin)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { user_id, internship_id, verified } = req.query;
    
    let sql = `
      SELECT c.*, i.title as internship_title, u.full_name as user_name, u.email as user_email
      FROM certificates c
      LEFT JOIN internships i ON c.internship_id = i.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (user_id) {
      sql += ' AND c.user_id = ?';
      params.push(user_id);
    }
    
    if (internship_id) {
      sql += ' AND c.internship_id = ?';
      params.push(internship_id);
    }
    
    if (verified !== undefined) {
      sql += ' AND c.is_verified = ?';
      params.push(verified === 'true');
    }
    
    sql += ' ORDER BY c.created_at DESC';
    
    const certificates = await query(sql, params);
    res.json({ certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get certificate by ID (admin or owner)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const certs = await query(`
      SELECT c.*, i.title as internship_title, u.full_name as user_name, u.email as user_email
      FROM certificates c
      LEFT JOIN internships i ON c.internship_id = i.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [req.params.id]);
    
    if (certs.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    const cert = certs[0];
    
    // Check if user is admin or owner
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && cert.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ certificate: cert });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

// Create certificate (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    const certificateId = data.certificate_id || `CERT-${Date.now()}`;
    
    // Helper function to convert undefined to null
    const val = (v, defaultValue = null) => v !== undefined ? v : defaultValue;
    
    // Generate verification hash
    const verificationHash = crypto
      .createHash('sha256')
      .update(certificateId + data.recipient_name + data.completion_date + Date.now())
      .digest('hex');

    await query(`
      INSERT INTO certificates (
        id, certificate_id, internship_id, application_id, user_id,
        recipient_name, recipient_email, course_name, duration,
        completion_date, issue_date, grade, score, certificate_url,
        qr_code_url, verification_hash, is_verified, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      certificateId,
      val(data.internship_id),
      val(data.application_id),
      val(data.user_id),
      val(data.recipient_name),
      val(data.recipient_email),
      val(data.course_name),
      val(data.duration),
      val(data.completion_date),
      val(data.issue_date),
      val(data.grade),
      val(data.score),
      val(data.certificate_url),
      val(data.qr_code_url),
      verificationHash,
      val(data.is_verified, true),
      val(data.is_active, true)
    ]);

    res.status(201).json({ 
      message: 'Certificate created successfully', 
      id,
      certificate_id: certificateId,
      verification_hash: verificationHash
    });
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: error.message || 'Failed to create certificate' });
  }
});

// Update certificate (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const data = req.body;

    await query(`
      UPDATE certificates SET
        recipient_name = ?, recipient_email = ?, course_name = ?, duration = ?,
        completion_date = ?, issue_date = ?, grade = ?, score = ?,
        certificate_url = ?, qr_code_url = ?, is_verified = ?, is_active = ?
      WHERE id = ?
    `, [
      data.recipient_name,
      data.recipient_email,
      data.course_name,
      data.duration,
      data.completion_date,
      data.issue_date,
      data.grade,
      data.score,
      data.certificate_url,
      data.qr_code_url,
      data.is_verified,
      data.is_active,
      req.params.id
    ]);

    res.json({ message: 'Certificate updated successfully' });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ error: error.message || 'Failed to update certificate' });
  }
});

// Delete certificate (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

export default router;
