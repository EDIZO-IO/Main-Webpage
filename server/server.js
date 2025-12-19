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
