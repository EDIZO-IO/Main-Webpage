import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authenticate, isAdmin, isSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT id, email, full_name, phone, role, is_active, email_verified, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID (Admin only)
 */
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT id, email, full_name, phone, role, is_active, email_verified, created_at 
      FROM users 
      WHERE id = ?
    `, [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * POST /api/users
 * Create new admin user (Super Admin only)
 */
router.post('/', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body;
    
    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Email, password, and full name are required' 
      });
    }
    
    // Check if user already exists
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Validate role
    const validRoles = ['user', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be user, admin, or super_admin' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate user ID
    const userId = uuidv4();
    
    // Insert user into database
    await query(
      `INSERT INTO users (id, email, password_hash, full_name, phone, role, email_verified, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, passwordHash, fullName, phone || null, role || 'admin', true, true]
    );
    
    res.status(201).json({ 
      message: 'Admin user created successfully',
      user: { 
        id: userId, 
        email, 
        full_name: fullName, 
        role,
        phone 
      }
    });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ 
      error: 'Failed to create admin user',
      details: error.message 
    });
  }
});

/**
 * PUT /api/users/:id
 * Update user (Super Admin only)
 */
router.put('/:id', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { fullName, phone, role, isActive } = req.body;
    
    const updates = [];
    const params = [];
    
    if (fullName !== undefined) {
      updates.push('full_name = ?');
      params.push(fullName);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (role !== undefined) {
      const validRoles = ['user', 'admin', 'super_admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      updates.push('role = ?');
      params.push(role);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(isActive);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    params.push(req.params.id);
    
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * PUT /api/users/:id/reset-password
 * Reset user password (Super Admin only)
 */
router.put('/:id/reset-password', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, req.params.id]);
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user (Super Admin only)
 */
router.delete('/:id', authenticate, isSuperAdmin, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
