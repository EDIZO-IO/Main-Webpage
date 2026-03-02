import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database
import { testConnection } from './config/database.js';

// Import middleware
import uploadsMiddleware from './middleware/uploads.js';

// Import routes
import authRoutes from './routes/auth.js';
import internshipRoutes from './routes/internships.js';
import serviceRoutes from './routes/services.js';
import applicationRoutes from './routes/applications.js';
import certificateRoutes from './routes/certificates.js';
import teamRoutes from './routes/team.js';
import projectRoutes from './routes/projects.js';
import eventRoutes from './routes/events.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import statRoutes from './routes/stats.js';
import blogRoutes from './routes/blogs.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - Allow all domains directly
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://www.edizo.in',
    'https://edizo.in',
    'https://adminedizo.netlify.app',
    'https://edizo-backend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files for uploads (with CORS)
app.use(uploadsMiddleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('⚠️  Server starting without database connection');
  }
  
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 EDIZO Backend Server Running!            ║
║                                               ║
║   Port: ${PORT}                                ║
║   Environment: ${process.env.NODE_ENV || 'development'}                     ║
║                                               ║
║   API Endpoints:                              ║
║   - /api/auth                                 ║
║   - /api/internships                          ║
║   - /api/services                             ║
║   - /api/applications                         ║
║   - /api/certificates                         ║
║   - /api/team                                 ║
║   - /api/projects                             ║
║   - /api/events                               ║
║   - /api/testimonials                         ║
║   - /api/contact                              ║
║   - /api/stats                                ║
║   - /api/blogs                                ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);
  });
};

startServer();

export default app;
