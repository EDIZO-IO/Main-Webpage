import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { convert } from 'html-to-text';
import { google } from 'googleapis';

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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend - Google Sheets Integration Active');
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

// ✅ Function: Save Internship Application to Google Sheets
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

    const values = [[
      currentDate,                          // A - Timestamp
      data.name || '',                      // B - Name
      data.email || '',                     // C - Email
      data.phone || '',                     // D - Phone
      data.university || '',                // E - University
      data.yearOfStudy || '',               // F - Year of Study
      data.education || '',                 // G - Education
      data.internshipTitle || '',           // H - Internship Title
      data.company || '',                   // I - Company
      data.coursePeriod || '',              // J - Duration
      data.price ? `₹${data.price}` : '',  // K - Price
      data.academicExperience || '',        // L - Academic Experience
      data.message || '',                   // M - Cover Letter
      'Pending',                            // N - Status
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:N`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('✅ Application saved successfully!');
    console.log('Updated range:', response.data.updates?.updatedRange);
    return response.data;
  } catch (error) {
    console.error('❌ Error saving application:', error.message);
    if (error.code) console.error('Error code:', error.code);
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
      currentDate,           // A - Timestamp
      data.name || '',       // B - Name
      data.email || '',      // C - Email
      data.phone || '',      // D - Phone
      data.subject || '',    // E - Subject
      data.message || '',    // F - Message
      'New',                 // G - Status
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

// ✅ Email Setup (Optional - for contact form notifications)
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

// ✅ ENDPOINT: Submit Internship Application (Save to Google Sheets)
app.post('/api/submit-application', limiter, async (req, res) => {
  try {
    const data = req.body;
    
    console.log('📥 Internship application received:', {
      name: data.name,
      email: data.email,
      internship: data.internshipTitle,
      duration: data.coursePeriod,
      price: data.price,
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

    // Save to Google Sheets
    await appendToSheet(data);

    console.log('✅ Application saved successfully');

    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully! We will contact you within 2-3 business days.',
    });
  } catch (err) {
    console.error('❌ Error in submit-application:', err.message);
    res.status(500).json({ 
      success: false, 
      message: `Submission failed: ${err.message}` 
    });
  }
});

// ✅ ENDPOINT: Submit Contact Form (Save to Google Sheets + Optional Email)
app.post('/api/submit-contact', limiter, async (req, res) => {
  try {
    const data = req.body;
    
    console.log('📥 Contact form received:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
    });
    
    // Validation
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

    // Save to Google Sheets (PRIMARY)
    await appendContactToSheet(data);

    // Optional: Send notification emails (SECONDARY - won't fail if email service is down)
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
      // Don't fail the request if email fails - data is already saved to sheets
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

// ✅ LEGACY ENDPOINT: Keep old contact endpoint for backwards compatibility
app.post('/api/send-contact-email', limiter, async (req, res) => {
  // Redirect to new endpoint
  return app.handle(req, res, '/api/submit-contact');
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error' 
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
  console.log('📧 Applications → Applications tab');
  console.log('📞 Contacts → Contacts tab');
  console.log('✉️ Email: Optional notifications');
  console.log('🚀 ========================================\n');
});

// ✅ Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('\n❌ SIGTERM received. Shutting down gracefully...');
  transporter.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n❌ SIGINT received. Shutting down gracefully...');
  transporter.close();
  process.exit(0);
});
