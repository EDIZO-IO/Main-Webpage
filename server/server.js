import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { convert } from 'html-to-text';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend - Google Sheets API Integration Active');
});

// ✅ Append to Google Sheets using REST API (No googleapis library)
async function appendToSheet(data) {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const SHEET_NAME = process.env.APPLICATIONS_SHEET_NAME || 'Applications';
    const API_KEY = process.env.GOOGLE_API_KEY;
    
    console.log('📝 Saving to Google Sheets...');
    console.log('Sheet ID:', SHEET_ID);
    console.log('Sheet Name:', SHEET_NAME);
    
    if (!SHEET_ID || !API_KEY) {
      throw new Error('Missing GOOGLE_SHEET_ID or GOOGLE_API_KEY');
    }
    
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
      data.university || '',
      data.yearOfStudy || '',
      data.education || '',
      data.internshipTitle || '',
      data.company || '',
      data.coursePeriod || '',
      data.price ? `₹${data.price}` : '',
      data.academicExperience || '',
      data.message || '',
      'Pending',
    ]];

    console.log('Data to save:', values[0]);

    // Using Google Sheets API v4 REST endpoint
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:N:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Sheets API Error:', errorData);
      throw new Error(errorData.error?.message || `Sheets API returned ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Successfully saved to Google Sheets!');
    console.log('Updated range:', result.updates?.updatedRange);
    return result;
  } catch (error) {
    console.error('❌ Error saving to sheet:', error.message);
    throw new Error(`Failed to save to Google Sheets: ${error.message}`);
  }
}

// Email configuration
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
      console.log(`✅ Email sent: ${info.messageId}`);
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

// ✅ Internship application submission endpoint
app.post('/api/submit-application', limiter, async (req, res) => {
  try {
    const data = req.body;
    
    console.log('📥 Application received:', {
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
    console.error('❌ Submission error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: `Submission failed: ${err.message}` 
    });
  }
});

// Contact form endpoint
app.post('/api/send-contact-email', limiter, async (req, res) => {
  try {
    const data = req.body;
    const userEmail = data.email;
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const userHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Thank You, ${data.name}!</h2>
        <p>We've received your message at EDIZO. Our team will respond soon.</p>
        <p><strong>EDIZO Team</strong></p>
      </div>`;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>📨 New Contact Form Submission</h2>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
          <li><strong>Subject:</strong> ${data.subject || 'N/A'}</li>
          <li><strong>Message:</strong> ${data.message}</li>
        </ul>
      </div>`;
      
    await Promise.all([
      sendMail(userEmail, 'We received your message', userHtml),
      sendMail(adminEmail, `Contact Form: ${data.subject || 'New'}`, adminHtml),
    ]);

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (err) {
    console.error('❌ Contact email error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   EDIZO Backend Server Started`);
  console.log('🚀 ========================================');
  console.log(`📍 Local:  http://localhost:${PORT}`);
  console.log(`📍 Render: https://main-webpage-l85m.onrender.com`);
  console.log('📊 Google Sheets: API Key Authentication');
  console.log('✉️ Email Service: Contact Form Only');
  console.log('🚀 ========================================\n');
});

process.on('SIGTERM', () => {
  console.log('\n❌ SIGTERM signal received: closing HTTP server');
  transporter.close();
  process.exit(0);
});
