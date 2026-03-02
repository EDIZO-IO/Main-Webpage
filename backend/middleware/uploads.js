import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directories exist
const uploadDirs = [
  'uploads',
  'uploads/services',
  'uploads/internships',
  'uploads/team',
  'uploads/projects',
  'uploads/events',
  'uploads/blogs'
];

uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Middleware to serve uploaded files with proper CORS
router.use('/uploads', (req, res, next) => {
  // Allow CORS for image files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Set cache headers for better performance
  res.header('Cache-Control', 'public, max-age=31536000');
  
  next();
});

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
  dotfiles: 'ignore',
  extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf']
}));

// Health check for uploads
router.get('/uploads/health', (req, res) => {
  res.json({
    status: 'ok',
    uploads_path: path.join(__dirname, '..', 'uploads'),
    directories: uploadDirs
  });
});

export default router;
