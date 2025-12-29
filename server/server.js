// server.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { convert } from 'html-to-text';
import { google } from 'googleapis';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://edizo-intern.netlify.app',
  'https://edizo-io.netlify.app',
  'https://main-webpage.netlify.app',
  'https://www.edizo.in',
  'https://edizo.in',
];
const netlifyPattern = /^https:\/\/.*\.netlify\.app$/;

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
    imgSrc: ["'self'", 'data:', 'https:'],
  },
}));

app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 Request from:', origin || 'undefined');
    if (!origin || allowedOrigins.includes(origin) || netlifyPattern.test(origin)) {
      return callback(null, true);
    }
    console.warn('❌ CORS blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ MongoDB Connection
let mongoConnected = false;
const connectMongoDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      mongoConnected = true;
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️ MONGODB_URI not provided, testimonials disabled');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
};
connectMongoDB();

// ✅ Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, default: '' },
  image: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  service: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// ✅ Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorImage: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  category: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: Number, default: 5 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  seoDescription: { type: String, default: '' },
  keywords: [{ type: String }],
  publishedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = new Date();
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

// ✅ Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'active',
    message: '✅ EDIZO Backend - All Services Active',
    timestamp: new Date().toISOString(),
    services: {
      googleSheets: sheets ? 'connected' : 'disconnected',
      email: transporter ? 'ready' : 'unavailable',
      mongodb: mongoConnected ? 'connected' : 'disconnected'
    }
  });
});

// ✅ Initialize Google Sheets API with Service Account
let sheets;
try {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets API initialized with Service Account');
} catch (error) {
  console.error('❌ Failed to initialize Google Sheets:', error.message);
}

// ========================================
// ✅ TESTIMONIALS API ENDPOINTS
// ========================================

// GET: Fetch all approved testimonials (public)
app.get('/api/testimonials', async (req, res) => {
  try {
    const { featured, limit = 10 } = req.query;

    let query = { isApproved: true };
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('-isApproved -updatedAt');

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

// POST: Submit a new testimonial (public - needs approval)
app.post('/api/testimonials', limiter, async (req, res) => {
  try {
    const { name, role, company, image, rating, review, service } = req.body;

    // Validation
    if (!name || !role || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Name, role, rating, and review are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const testimonial = new Testimonial({
      name,
      role,
      company: company || '',
      image: image || '',
      rating,
      review,
      service: service || '',
      isApproved: false, // Needs admin approval
      isFeatured: false
    });

    await testimonial.save();

    console.log('✅ New testimonial submitted:', name);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted for review.',
      data: { id: testimonial._id }
    });
  } catch (error) {
    console.error('❌ Error submitting testimonial:', error.message);
    res.status(500).json({ success: false, message: 'Failed to submit testimonial' });
  }
});

// GET: Fetch all testimonials (admin - includes unapproved)
app.get('/api/admin/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('❌ Error fetching all testimonials:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

// PUT: Update testimonial (admin - approve, feature, edit)
app.put('/api/admin/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    updates.updatedAt = new Date();

    const testimonial = await Testimonial.findByIdAndUpdate(id, updates, { new: true });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    console.log('✅ Testimonial updated:', id);

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('❌ Error updating testimonial:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
});

// DELETE: Delete testimonial (admin)
app.delete('/api/admin/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    console.log('✅ Testimonial deleted:', id);

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting testimonial:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
});

// POST: Seed initial testimonials (admin)
app.post('/api/admin/testimonials/seed', async (req, res) => {
  try {
    // Clear existing testimonials
    await Testimonial.deleteMany({});

    // Seed with sample testimonials
    const sampleTestimonials = [
      {
        name: 'Rahul Sharma',
        role: 'Startup Founder',
        company: 'TechVenture Labs',
        image: '',
        rating: 5,
        review: 'Edizo transformed our vision into a stunning website. Their team understood our needs perfectly and delivered beyond expectations. The attention to detail and modern design approach made our startup stand out from the competition.',
        service: 'Web Development',
        isApproved: true,
        isFeatured: true
      },
      {
        name: 'Priya Patel',
        role: 'Marketing Director',
        company: 'GrowthHub India',
        image: '',
        rating: 5,
        review: 'Working with Edizo on our UI/UX redesign was a game-changer. They brought fresh, innovative ideas that significantly improved our user engagement. Highly professional and responsive team!',
        service: 'UI/UX Design',
        isApproved: true,
        isFeatured: true
      },
      {
        name: 'Arjun Mehta',
        role: 'Product Manager',
        company: 'InnovateTech',
        image: '',
        rating: 5,
        review: 'The mobile app Edizo developed for us exceeded all expectations. Smooth performance, beautiful interface, and delivered right on schedule. They are now our go-to development partner.',
        service: 'App Development',
        isApproved: true,
        isFeatured: true
      },
      {
        name: 'Sneha Kapoor',
        role: 'Business Owner',
        company: 'StyleBoutique',
        image: '',
        rating: 4,
        review: 'Excellent graphic design work! Edizo created our complete brand identity - logo, business cards, social media templates. Very creative team with quick turnaround times.',
        service: 'Graphic Design',
        isApproved: true,
        isFeatured: false
      },
      {
        name: 'Vikram Singh',
        role: 'CEO',
        company: 'DataFlow Solutions',
        image: '',
        rating: 5,
        review: 'The API development services from Edizo were outstanding. They built a robust, well-documented API that seamlessly integrated with our existing systems. Expert-level work!',
        service: 'API Development',
        isApproved: true,
        isFeatured: false
      },
      {
        name: 'Ananya Reddy',
        role: 'Digital Marketing Head',
        company: 'BrandBoost',
        image: '',
        rating: 5,
        review: 'Our SEO rankings improved dramatically after working with Edizo. They implemented a comprehensive strategy that doubled our organic traffic within 3 months. Truly impressive results!',
        service: 'SEO Optimization',
        isApproved: true,
        isFeatured: true
      }
    ];

    await Testimonial.insertMany(sampleTestimonials);

    console.log('✅ Testimonials seeded successfully');

    res.json({
      success: true,
      message: `${sampleTestimonials.length} testimonials seeded successfully`
    });
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error.message);
    res.status(500).json({ success: false, message: 'Failed to seed testimonials' });
  }
});

// ========================================
// ✅ BLOG API ENDPOINTS
// ========================================

// GET: Fetch all published blogs (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1, search } = req.query;

    let query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ featured: -1, publishedDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-content'),
      Blog.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: blogs
    });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

// GET: Fetch single blog by slug or ID (public)
app.get('/api/blogs/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;

    let blog = await Blog.findOne({
      $or: [{ slug: slugOrId }, { _id: slugOrId }],
      status: 'published'
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
});

// POST: Like a blog (public)
app.post('/api/blogs/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.likes += 1;
    await blog.save();

    res.json({
      success: true,
      likes: blog.likes
    });
  } catch (error) {
    console.error('❌ Error liking blog:', error.message);
    res.status(500).json({ success: false, message: 'Failed to like blog' });
  }
});

// GET: Fetch blog categories (public)
app.get('/api/blog-categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    res.json({
      success: true,
      data: ['All', ...categories.sort()]
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// GET: Fetch all blogs (admin - includes drafts)
app.get('/api/admin/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .select('-content');

    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('❌ Error fetching all blogs:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

// POST: Create new blog (admin)
app.post('/api/admin/blogs', async (req, res) => {
  try {
    const blogData = req.body;

    // Validation
    if (!blogData.title || !blogData.content || !blogData.author || !blogData.category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, author, and category are required'
      });
    }

    // Generate slug if not provided
    if (!blogData.slug) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug exists
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    if (existingBlog) {
      blogData.slug = `${blogData.slug}-${Date.now()}`;
    }

    // Set published date if status is published
    if (blogData.status === 'published' && !blogData.publishedDate) {
      blogData.publishedDate = new Date();
    }

    // Calculate read time if not provided
    if (!blogData.readTime) {
      const wordsPerMinute = 200;
      const words = blogData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      blogData.readTime = Math.ceil(words / wordsPerMinute);
    }

    const blog = new Blog(blogData);
    await blog.save();

    console.log('✅ Blog created:', blog.title);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('❌ Error creating blog:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create blog' });
  }
});

// PUT: Update blog (admin)
app.put('/api/admin/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Set published date if status is being set to published
    if (updates.status === 'published') {
      const currentBlog = await Blog.findById(id);
      if (currentBlog && currentBlog.status !== 'published' && !updates.publishedDate) {
        updates.publishedDate = new Date();
      }
    }

    updates.updatedAt = new Date();

    const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    console.log('✅ Blog updated:', blog.title);

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('❌ Error updating blog:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update blog' });
  }
});

// DELETE: Delete blog (admin)
app.delete('/api/admin/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    console.log('✅ Blog deleted:', blog.title);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting blog:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
});

// POST: Seed sample blogs (admin)
app.post('/api/admin/blogs/seed', async (req, res) => {
  try {
    // Clear existing blogs
    await Blog.deleteMany({});

    const sampleBlogs = [
      {
        title: 'The Future of Web Development in 2025',
        slug: 'future-of-web-development-2025',
        description: 'Explore the cutting-edge technologies and trends shaping the future of web development, from AI-powered tools to new frameworks.',
        content: `<h2>Introduction</h2><p>The web development landscape is evolving rapidly. In 2025, we're seeing unprecedented changes in how websites and applications are built.</p><h2>Key Trends</h2><h3>1. AI-Powered Development</h3><p>Artificial intelligence is revolutionizing how developers write code, test applications, and optimize user experiences.</p><h3>2. Edge Computing</h3><p>With edge computing becoming mainstream, websites are faster and more responsive than ever before.</p><h3>3. WebAssembly Growth</h3><p>WebAssembly continues to grow, enabling high-performance applications directly in the browser.</p><h2>Conclusion</h2><p>Staying ahead in web development requires continuous learning and adaptation to new technologies.</p>`,
        author: 'Edizo Team',
        authorImage: '/assets/team/edizo-team.jpg',
        thumbnail: '/assets/blogs/web-development-future.jpg',
        category: 'Technology',
        tags: ['Web Development', 'AI', 'Technology', 'Future Trends'],
        readTime: 8,
        featured: true,
        status: 'published',
        rating: 4.8,
        views: 1250,
        likes: 89,
        comments: 12,
        seoDescription: 'Discover the latest trends and technologies shaping web development in 2025.',
        keywords: ['web development', 'AI', 'future', '2025', 'technology trends'],
        publishedDate: new Date('2024-12-15')
      },
      {
        title: 'Why UI/UX Design Matters for Business Success',
        slug: 'why-ui-ux-design-matters',
        description: 'Learn how great UI/UX design can dramatically improve user engagement, conversions, and overall business performance.',
        content: `<h2>The Power of Good Design</h2><p>In today's competitive digital landscape, having great products isn't enough. The way users interact with your digital products can make or break your business.</p><h2>Key Benefits of Good UI/UX</h2><h3>1. Increased Conversions</h3><p>Well-designed interfaces guide users towards desired actions, significantly improving conversion rates.</p><h3>2. Better User Retention</h3><p>Users stay longer and return more frequently to platforms that are easy and enjoyable to use.</p><h3>3. Reduced Support Costs</h3><p>Intuitive designs mean fewer confused users and less burden on your support team.</p><h2>Best Practices</h2><p>Focus on user research, maintain consistency, and always test your designs with real users.</p>`,
        author: 'Edizo Design Team',
        authorImage: '/assets/team/design-team.jpg',
        thumbnail: '/assets/blogs/ui-ux-matters.jpg',
        category: 'Design',
        tags: ['UI/UX', 'Design', 'User Experience', 'Business'],
        readTime: 6,
        featured: true,
        status: 'published',
        rating: 4.9,
        views: 980,
        likes: 76,
        comments: 8,
        seoDescription: 'Understand the importance of UI/UX design for business success and user engagement.',
        keywords: ['UI/UX', 'design', 'user experience', 'business', 'conversion'],
        publishedDate: new Date('2024-12-10')
      },
      {
        title: 'Getting Started with Mobile App Development',
        slug: 'getting-started-mobile-app-development',
        description: 'A comprehensive guide for beginners looking to build their first mobile application using modern frameworks.',
        content: `<h2>Choosing Your Path</h2><p>Mobile app development offers multiple approaches: native, hybrid, or cross-platform. Each has its pros and cons.</p><h2>Popular Frameworks</h2><h3>React Native</h3><p>Facebook's framework allows you to build native apps using JavaScript and React.</p><h3>Flutter</h3><p>Google's toolkit provides excellent performance and beautiful UI components.</p><h3>Native Development</h3><p>Swift for iOS and Kotlin for Android offer the best performance but require separate codebases.</p><h2>Getting Started</h2><p>Begin with a simple project, learn the basics, and gradually tackle more complex features.</p>`,
        author: 'Edizo Development Team',
        authorImage: '/assets/team/dev-team.jpg',
        thumbnail: '/assets/blogs/mobile-app-dev.jpg',
        category: 'Development',
        tags: ['Mobile Development', 'React Native', 'Flutter', 'Apps'],
        readTime: 10,
        featured: false,
        status: 'published',
        rating: 4.7,
        views: 756,
        likes: 54,
        comments: 6,
        seoDescription: 'Learn how to start building mobile apps with this comprehensive beginner guide.',
        keywords: ['mobile app', 'development', 'React Native', 'Flutter', 'beginner'],
        publishedDate: new Date('2024-12-05')
      },
      {
        title: 'SEO Best Practices for 2025',
        slug: 'seo-best-practices-2025',
        description: 'Master the latest SEO strategies to boost your website visibility and drive organic traffic.',
        content: `<h2>SEO in 2025</h2><p>Search engine optimization continues to evolve. Staying updated with the latest practices is crucial for online success.</p><h2>Core Web Vitals</h2><p>Google's page experience signals remain important. Focus on loading speed, interactivity, and visual stability.</p><h2>Content Quality</h2><p>High-quality, helpful content that satisfies user intent is more important than ever.</p><h2>AI and Search</h2><p>With AI-powered search features, optimizing for conversational queries and featured snippets is essential.</p>`,
        author: 'Edizo Marketing Team',
        authorImage: '/assets/team/marketing-team.jpg',
        thumbnail: '/assets/blogs/seo-2025.jpg',
        category: 'Marketing',
        tags: ['SEO', 'Digital Marketing', 'Content', 'Google'],
        readTime: 7,
        featured: false,
        status: 'published',
        rating: 4.6,
        views: 620,
        likes: 42,
        comments: 5,
        seoDescription: 'Stay ahead with the latest SEO strategies and best practices for 2025.',
        keywords: ['SEO', 'search engine optimization', '2025', 'digital marketing'],
        publishedDate: new Date('2024-11-28')
      },
      {
        title: 'Building a Successful Startup: Lessons Learned',
        slug: 'building-successful-startup-lessons',
        description: 'Real insights and lessons from the journey of building and growing a tech startup.',
        content: `<h2>The Startup Journey</h2><p>Building a startup is challenging but incredibly rewarding. Here are key lessons from our experience.</p><h2>Focus on the Problem</h2><p>Don't fall in love with your solution. Fall in love with the problem you're solving.</p><h2>Build MVP First</h2><p>Launch with a minimum viable product and iterate based on real user feedback.</p><h2>Team Matters</h2><p>Surround yourself with passionate, skilled people who believe in your vision.</p><h2>Stay Resilient</h2><p>Expect setbacks. Success comes to those who persist through challenges.</p>`,
        author: 'Edizo Founders',
        authorImage: '/assets/team/founders.jpg',
        thumbnail: '/assets/blogs/startup-lessons.jpg',
        category: 'Business',
        tags: ['Startup', 'Entrepreneurship', 'Business', 'Growth'],
        readTime: 9,
        featured: true,
        status: 'published',
        rating: 4.9,
        views: 1100,
        likes: 95,
        comments: 15,
        seoDescription: 'Learn valuable lessons from real startup experiences and growth strategies.',
        keywords: ['startup', 'entrepreneurship', 'business growth', 'lessons'],
        publishedDate: new Date('2024-11-20')
      }
    ];

    await Blog.insertMany(sampleBlogs);

    console.log('✅ Blogs seeded successfully');

    res.json({
      success: true,
      message: `${sampleBlogs.length} blogs seeded successfully`
    });
  } catch (error) {
    console.error('❌ Error seeding blogs:', error.message);
    res.status(500).json({ success: false, message: 'Failed to seed blogs' });
  }
});

// ========================================
// ✅ EXISTING GOOGLE SHEETS FUNCTIONS
// ========================================

// ✅ Helper function to format price
const formatPrice = (price) => {
  const numPrice = Number(price) || 0;
  return numPrice > 0 ? `₹${numPrice.toLocaleString('en-IN')}` : '₹0';
};

// ✅ Helper function to format discount
const formatDiscount = (discount) => {
  const numDiscount = Number(discount) || 0;
  return numDiscount > 0 ? `${numDiscount}%` : 'No Discount';
};

// ✅ UPDATED: Function to save internship application with discount info
async function appendToSheet(data) {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const SHEET_NAME = process.env.APPLICATIONS_SHEET_NAME || 'Applications';

    console.log('📝 Saving internship application to Google Sheets...');

    const currentDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // ✅ Handle pricing with proper validation
    const originalPrice = Number(data.originalPrice) || 0;
    const discount = Number(data.discount) || 0;
    const finalPrice = Number(data.finalPrice) || originalPrice;
    const savings = Number(data.savings) || 0;

    const values = [[
      currentDate,                              // A - Timestamp
      data.name || '',                          // B - Name
      data.email || '',                         // C - Email
      data.phone || '',                         // D - Phone
      data.university || '',                    // E - University
      data.yearOfStudy || '',                   // F - Year of Study
      data.education || '',                     // G - Education
      data.internshipTitle || '',               // H - Internship Title
      data.company || '',                       // I - Company
      data.coursePeriod || '',                  // J - Duration
      formatPrice(originalPrice),               // K - Original Price
      formatDiscount(discount),                 // L - Discount %
      formatPrice(finalPrice),                  // M - Final Price (after discount)
      formatPrice(savings),                     // N - Savings
      data.academicExperience || '',            // O - Academic Experience
      data.message || '',                       // P - Cover Letter
      'Pending',                                // Q - Status
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('✅ Application saved successfully!');
    console.log('Updated range:', response.data.updates?.updatedRange);
    console.log('💰 Price Details:', {
      original: formatPrice(originalPrice),
      discount: formatDiscount(discount),
      final: formatPrice(finalPrice),
      savings: formatPrice(savings)
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error saving application:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.errors) console.error('Error details:', error.errors);
    throw new Error(`Failed to save application: ${error.message}`);
  }
}

// ✅ Function: Save Contact Form to Google Sheets
async function appendContactToSheet(data) {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const SHEET_NAME = 'Contacts';

    console.log('📝 Saving contact form to Google Sheets...');

    const currentDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const values = [[
      currentDate,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || '',
      'New',
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('✅ Contact saved successfully!');
    console.log('Updated range:', response.data.updates?.updatedRange);
    return response.data;
  } catch (error) {
    console.error('❌ Error saving contact:', error.message);
    if (error.code) console.error('Error code:', error.code);
    throw new Error(`Failed to save contact: ${error.message}`);
  }
}

// ✅ Email Setup
const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  maxConnections: 5,
  maxMessages: 10,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: { rejectUnauthorized: false },
});

transporter.verify((error) => {
  if (error) {
    console.error('⚠️ Email service unavailable:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

async function sendMail(to, subject, html, retries = 3) {
  const mailOptions = {
    from: `"EDIZO Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text: convert(html, { wordwrap: 130 }),
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`❌ Email attempt ${attempt} failed:`, error.message);
      if (attempt === retries) {
        throw new Error(`Email failed after ${retries} attempts`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// ✅ NEW: Send application confirmation email with discount details
async function sendApplicationEmails(data) {
  try {
    const originalPrice = Number(data.originalPrice) || 0;
    const discount = Number(data.discount) || 0;
    const finalPrice = Number(data.finalPrice) || originalPrice;
    const savings = Number(data.savings) || 0;

    // User confirmation email with discount info
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">EDIZO</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Application Received!</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #dc2626; margin-top: 0;">Thank You, ${data.name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            We've successfully received your application for <strong>${data.internshipTitle}</strong> at <strong>${data.company}</strong>.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Application Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Program:</strong></td>
                <td style="padding: 8px 0; color: #1f2937;">${data.internshipTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Duration:</strong></td>
                <td style="padding: 8px 0; color: #1f2937;">${data.coursePeriod}</td>
              </tr>
              ${discount > 0 ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Original Price:</strong></td>
                <td style="padding: 8px 0; color: #1f2937; text-decoration: line-through;">${formatPrice(originalPrice)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Discount:</strong></td>
                <td style="padding: 8px 0; color: #16a34a; font-weight: bold;">${formatDiscount(discount)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>You Save:</strong></td>
                <td style="padding: 8px 0; color: #16a34a; font-weight: bold;">${formatPrice(savings)}</td>
              </tr>
              ` : ''}
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 12px 0; color: #1f2937;"><strong>Final Price:</strong></td>
                <td style="padding: 12px 0; color: #dc2626; font-size: 18px; font-weight: bold;">${formatPrice(finalPrice)}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ Next Steps:</strong><br>
              Our team will review your application and contact you within <strong>2-3 business days</strong> at ${data.email}.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Best regards,<br>
            <strong style="color: #dc2626;">The EDIZO Team</strong>
          </p>
        </div>
      </div>`;

    // Admin notification email
    const adminHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #dc2626;">🎓 New Internship Application</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Applicant Information:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</li>
            <li style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</li>
            <li style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li style="margin: 8px 0;"><strong>University:</strong> ${data.university}</li>
            <li style="margin: 8px 0;"><strong>Year:</strong> ${data.yearOfStudy}</li>
            <li style="margin: 8px 0;"><strong>Education:</strong> ${data.education}</li>
          </ul>
          
          <h3>Program Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0;"><strong>Internship:</strong> ${data.internshipTitle}</li>
            <li style="margin: 8px 0;"><strong>Company:</strong> ${data.company}</li>
            <li style="margin: 8px 0;"><strong>Duration:</strong> ${data.coursePeriod}</li>
          </ul>

          <h3>Pricing:</h3>
          <ul style="list-style: none; padding: 0; background: white; padding: 15px; border-radius: 4px;">
            <li style="margin: 8px 0;"><strong>Original Price:</strong> ${formatPrice(originalPrice)}</li>
            <li style="margin: 8px 0; color: #16a34a;"><strong>Discount:</strong> ${formatDiscount(discount)}</li>
            <li style="margin: 8px 0; color: #16a34a;"><strong>Savings:</strong> ${formatPrice(savings)}</li>
            <li style="margin: 8px 0; font-size: 18px; color: #dc2626;"><strong>Final Price:</strong> ${formatPrice(finalPrice)}</li>
          </ul>

          ${data.academicExperience ? `
          <h3>Academic Experience:</h3>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.academicExperience}</p>
          ` : ''}

          ${data.message ? `
          <h3>Cover Letter:</h3>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.message}</p>
          ` : ''}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>`;

    await Promise.all([
      sendMail(data.email, `Application Received - ${data.internshipTitle} | EDIZO`, userHtml),
      sendMail(
        process.env.APPLICATION_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER,
        `New Application: ${data.name} - ${data.internshipTitle}`,
        adminHtml
      ),
    ]);

    console.log('✅ Application emails sent successfully');
  } catch (emailError) {
    console.warn('⚠️ Email notification failed (non-critical):', emailError.message);
  }
}

// ✅ UPDATED ENDPOINT: Submit Internship Application with Discount Support
app.post('/api/submit-application', limiter, async (req, res) => {
  try {
    const data = req.body;

    console.log('📥 Internship application received:', {
      name: data.name,
      email: data.email,
      internship: data.internshipTitle,
      duration: data.coursePeriod,
      originalPrice: data.originalPrice,
      discount: data.discount,
      finalPrice: data.finalPrice,
      savings: data.savings,
    });

    // Validation
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    if (!data.name || !data.internshipTitle) {
      return res.status(400).json({
        success: false,
        message: 'Name and internship title are required'
      });
    }

    // ✅ Validate pricing information
    const finalPrice = Number(data.finalPrice);
    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing information'
      });
    }

    // Save to Google Sheets with discount info
    await appendToSheet(data);

    // Send confirmation emails (non-blocking)
    sendApplicationEmails(data).catch(err => {
      console.error('Email error (non-critical):', err.message);
    });

    console.log('✅ Application saved successfully with discount details');

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully! We will contact you within 2-3 business days.',
      data: {
        finalPrice: formatPrice(finalPrice),
        discount: formatDiscount(data.discount),
        savings: formatPrice(data.savings)
      }
    });
  } catch (err) {
    console.error('❌ Error in submit-application:', err.message);
    res.status(500).json({
      success: false,
      message: `Submission failed: ${err.message}`
    });
  }
});

// ✅ ENDPOINT: Submit Contact Form
app.post('/api/submit-contact', limiter, async (req, res) => {
  try {
    const data = req.body;

    console.log('📥 Contact form received:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
    });

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    if (!data.name || !data.subject || !data.message) {
      return res.status(400).json({
        success: false,
        message: 'Name, subject, and message are required'
      });
    }

    await appendContactToSheet(data);

    try {
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Thank You, ${data.name}!</h2>
          <p>We've received your message at <strong>EDIZO</strong>.</p>
          <p>Our team will review your inquiry and respond within 24-48 hours.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br><strong>EDIZO Team</strong></p>
        </div>`;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #dc2626;">📨 New Contact Form Submission</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</li>
            <li style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</li>
            <li style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li style="margin: 8px 0;"><strong>Subject:</strong> ${data.subject}</li>
            <li style="margin: 8px 0;"><strong>Message:</strong><br>${data.message}</li>
          </ul>
        </div>`;

      await Promise.all([
        sendMail(data.email, 'We received your message - EDIZO', userHtml),
        sendMail(process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER, `Contact: ${data.subject}`, adminHtml),
      ]);

      console.log('✅ Notification emails sent');
    } catch (emailError) {
      console.warn('⚠️ Email notification failed (non-critical):', emailError.message);
    }

    console.log('✅ Contact form saved successfully');

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
    });
  } catch (err) {
    console.error('❌ Error in submit-contact:', err.message);
    res.status(500).json({
      success: false,
      message: `Submission failed: ${err.message}`
    });
  }
});

// ========================================
// ✅ CERTIFICATE VERIFICATION API ENDPOINTS
// ========================================

// Sheet ID for Certificates (add CERTIFICATE_SHEET_ID to your .env)
const CERTIFICATE_SHEET_ID = process.env.CERTIFICATE_SHEET_ID || process.env.GOOGLE_SHEET_ID;

// ✅ Helper: Initialize All Required Sheets
async function initializeAllSheets() {
  if (!sheets) {
    console.log('⚠️ Google Sheets API not initialized yet. Retrying in 5s...');
    setTimeout(initializeAllSheets, 5000);
    return;
  }

  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const APPLICATIONS_SHEET = process.env.APPLICATIONS_SHEET_NAME || 'Applications';
  const CONTACTS_SHEET = 'Contacts';
  const CERTIFICATES_SHEET = 'Certificates';

  const requiredSheets = [
    {
      title: APPLICATIONS_SHEET,
      headers: ['Timestamp', 'Name', 'Email', 'Phone', 'University', 'Year', 'Education', 'Program', 'Company', 'Duration', 'Original Price', 'Discount', 'Final Price', 'Savings', 'Academic Exp', 'Cover Letter', 'Status']
    },
    {
      title: CONTACTS_SHEET,
      headers: ['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status']
    },
    {
      title: CERTIFICATES_SHEET,
      headers: ['Certificate ID', 'Intern Name', 'Program Name', 'Start Date', 'End Date', 'Issue Date', 'Status', 'Email']
    }
  ];

  try {
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID
    });

    const existingSheets = sheetInfo.data.sheets.map(s => s.properties.title);

    for (const sheet of requiredSheets) {
      if (!existingSheets.includes(sheet.title)) {
        console.log(`⚠️ Sheet '${sheet.title}' missing. Creating...`);

        // Create Sheet
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          resource: {
            requests: [{
              addSheet: {
                properties: { title: sheet.title }
              }
            }]
          }
        });

        // Add Headers
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${sheet.title}!A1`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [sheet.headers]
          }
        });

        console.log(`✅ Sheet '${sheet.title}' created with headers.`);
      }
    }
    console.log('✅ All Google Sheets tables verified.');
  } catch (error) {
    console.error('❌ Error initializing Google Sheets tables:', error.message);
  }
}

// Initialize on load
setTimeout(initializeAllSheets, 3000);


// GET: Verify a certificate by ID (public)
app.get('/api/certificates/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const trimmedId = certificateId.trim().toUpperCase();

    if (!trimmedId) {
      return res.status(400).json({
        isValid: false,
        message: 'Certificate ID is required'
      });
    }

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CERTIFICATE_SHEET_ID,
      range: 'Certificates!A:H', // Columns: CertificateID, InternName, ProgramName, StartDate, EndDate, IssueDate, Status, Email
    });

    const rows = response.data.values || [];

    if (rows.length <= 1) {
      return res.status(404).json({
        isValid: false,
        message: 'No certificates found in the system'
      });
    }

    // Find the certificate (skip header row)
    const certificate = rows.slice(1).find(row =>
      row[0] && row[0].trim().toUpperCase() === trimmedId
    );

    if (certificate) {
      console.log('✅ Certificate verified:', trimmedId);
      return res.json({
        isValid: true,
        data: {
          certificateId: certificate[0] || '',
          internName: certificate[1] || '',
          programName: certificate[2] || '',
          startDate: certificate[3] || '',
          endDate: certificate[4] || '',
          issueDate: certificate[5] || '',
          status: certificate[6] || 'Completed',
          email: certificate[7] || ''
        }
      });
    } else {
      console.log('❌ Certificate not found:', trimmedId);
      return res.status(404).json({
        isValid: false,
        message: 'Certificate not found. Please check the ID and try again.'
      });
    }
  } catch (error) {
    console.error('❌ Certificate verification error:', error.message);
    res.status(500).json({
      isValid: false,
      message: 'Error verifying certificate. Please try again later.'
    });
  }
});

// GET: Fetch all certificates (admin)
app.get('/api/admin/certificates', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CERTIFICATE_SHEET_ID,
      range: 'Certificates!A:H',
    });

    const rows = response.data.values || [];

    if (rows.length <= 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const headers = rows[0];
    const certificates = rows.slice(1).map((row, index) => ({
      id: index + 1,
      certificateId: row[0] || '',
      internName: row[1] || '',
      programName: row[2] || '',
      startDate: row[3] || '',
      endDate: row[4] || '',
      issueDate: row[5] || '',
      status: row[6] || 'Completed',
      email: row[7] || ''
    }));

    console.log(`✅ Fetched ${certificates.length} certificates`);

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    console.error('❌ Error fetching certificates:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates'
    });
  }
});

// POST: Add a new certificate (admin)
app.post('/api/admin/certificates', async (req, res) => {
  try {
    const { certificateId, internName, programName, startDate, endDate, issueDate, status, email } = req.body;

    // Validation
    if (!certificateId || !internName || !programName) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID, Intern Name, and Program Name are required'
      });
    }

    // Add to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: CERTIFICATE_SHEET_ID,
      range: 'Certificates!A:H',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          certificateId.trim().toUpperCase(),
          internName,
          programName,
          startDate || '',
          endDate || '',
          issueDate || new Date().toISOString().split('T')[0],
          status || 'Completed',
          email || ''
        ]]
      }
    });

    console.log('✅ Certificate added:', certificateId);

    res.status(201).json({
      success: true,
      message: 'Certificate added successfully',
      data: { certificateId: certificateId.trim().toUpperCase() }
    });
  } catch (error) {
    console.error('❌ Error adding certificate:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add certificate'
    });
  }
});

// DELETE: Delete a certificate (admin)
app.delete('/api/admin/certificates/:rowIndex', async (req, res) => {
  try {
    const { rowIndex } = req.params;
    const rowNum = parseInt(rowIndex) + 1; // +1 for header row

    // Get sheet ID first
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: CERTIFICATE_SHEET_ID,
    });

    const certificatesSheet = sheetInfo.data.sheets.find(s =>
      s.properties.title === 'Certificates'
    );

    if (!certificatesSheet) {
      return res.status(404).json({
        success: false,
        message: 'Certificates sheet not found'
      });
    }

    // Delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: CERTIFICATE_SHEET_ID,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: certificatesSheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: rowNum,
              endIndex: rowNum + 1
            }
          }
        }]
      }
    });

    console.log('✅ Certificate deleted at row:', rowNum);

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting certificate:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete certificate'
    });
  }
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('   EDIZO Backend Server');
  console.log('🚀 ========================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🔐 Auth: Service Account');
  console.log('📊 Google Sheets: Connected');
  console.log('🗄️ MongoDB: Testimonials enabled');
  console.log('📧 Applications → Applications tab');
  console.log('💰 Pricing: Discount support enabled');
  console.log('📞 Contacts → Contacts tab');
  console.log('⭐ Testimonials → MongoDB');
  console.log('✉️ Email: Automated notifications');
  console.log('🚀 ========================================\n');
});

// ✅ Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('\n❌ SIGTERM received. Shutting down gracefully...');
  transporter.close();
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n❌ SIGINT received. Shutting down gracefully...');
  transporter.close();
  await mongoose.connection.close();
  process.exit(0);
});
