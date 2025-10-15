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
    if (!origin || allowedOrigins.includes(origin) || netlifyPattern.test(origin)) {
      return callback(null, true);
    }
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
  res.send('✅ EDIZO Backend - Service Account Authentication Active');
});

// ✅ Initialize Google Sheets with Service Account
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

// ✅ Append to Google Sheets
async function appendToSheet(data) {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const SHEET_NAME = process.env.APPLICATIONS_SHEET_NAME || 'Applications';
    
    console.log('📝 Saving to Google Sheets...');
    
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

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:N`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('✅ Data saved successfully!');
    console.log('Updated:', response.data.updates?.updatedRange);
    return response.data;
  } catch (error) {
    console.error('❌ Sheet error:', error.message);
    if (error.code) console.error('Error code:', error.code);
    throw new Error(`Failed to save: ${error.message}`);
  }
}

// Email setup
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
    console.error('⚠️ Email unavailable:', error.message);
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
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Application endpoint
app.post('/api/submit-application', limiter, async (req, res) => {
  try {
    const data = req.body;
    
    console.log('📥 Application:', {
      name: data.name,
      email: data.email,
      internship: data.internshipTitle,
    });
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    if (!data.name || !data.internshipTitle) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    await appendToSheet(data);

    console.log('✅ Application saved');

    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully! We will contact you within 2-3 business days.',
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ success: false, message: `Submission failed: ${err.message}` });
  }
});

// Contact form
app.post('/api/send-contact-email', limiter, async (req, res) => {
  try {
    const data = req.body;
    const userEmail = data.email;
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL;

    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const userHtml = `<div><h2>Thank You, ${data.name}!</h2><p>We received your message.</p></div>`;
    const adminHtml = `<div><h2>📨 Contact</h2><ul><li><strong>Name:</strong> ${data.name}</li><li><strong>Email:</strong> ${data.email}</li><li><strong>Message:</strong> ${data.message}</li></ul></div>`;
      
    await Promise.all([
      sendMail(userEmail, 'Message received', userHtml),
      sendMail(adminEmail, `Contact: ${data.subject || 'New'}`, adminHtml),
    ]);

    res.status(200).json({ success: true, message: 'Emails sent' });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal error' });
});

app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('   EDIZO Backend Server');
  console.log('🚀 ========================================');
  console.log(`📍 Port: ${PORT}`);
  console.log('🔐 Auth: Service Account');
  console.log('📊 Sheets: Connected');
  console.log('✉️ Email: Ready');
  console.log('🚀 ========================================\n');
});

process.on('SIGTERM', () => {
  transporter.close();
  process.exit(0);
});
