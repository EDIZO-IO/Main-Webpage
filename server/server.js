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

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://edizo-intern.netlify.app',
  'https://edizo-io.netlify.app',
  'https://www.edizo.in',
  'https://edizo.in',
];
const netlifyPattern = /^https:\/\/.*\.netlify\.app$/;

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('🌐 Incoming request from:', origin || 'undefined');
      if (!origin || allowedOrigins.includes(origin) || netlifyPattern.test(origin)) {
        return callback(null, true);
      }
      console.warn('❌ Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend is running with Google Sheets integration.');
});

// ✅ Google Sheets Setup
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ✅ Function to append data to Google Sheets
async function appendToSheet(data) {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const SHEET_NAME = process.env.APPLICATIONS_SHEET_NAME || 'Applications';
    
    console.log('📝 Attempting to save to Google Sheets...');
    console.log('Sheet ID:', SHEET_ID);
    console.log('Sheet Name:', SHEET_NAME);
    
    const currentDate = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const values = [
      [
        currentDate, // A - Timestamp
        data.name || '', // B - Name
        data.email || '', // C - Email
        data.phone || '', // D - Phone
        data.university || '', // E - University
        data.yearOfStudy || '', // F - Year of Study
        data.education || '', // G - Education
        data.internshipTitle || '', // H - Internship Title
        data.company || '', // I - Company
        data.coursePeriod || '', // J - Duration
        data.price ? `₹${data.price}` : '', // K - Price
        data.academicExperience || '', // L - Academic Experience
        data.message || '', // M - Cover Letter
        'Pending', // N - Status
      ]
    ];

    console.log('Data to append:', values);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:N`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: values,
      },
    });

    console.log('✅ Data successfully appended to sheet');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error appending to sheet:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    throw new Error(`Failed to save to Google Sheets: ${error.message}`);
  }
}

// ✅ Nodemailer setup (for contact form)
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
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer verification failed:', error.message);
  } else {
    console.log('✅ Nodemailer is ready.');
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
      console.error(`❌ Attempt ${attempt} failed to send email to ${to}:`, error.message);
      if (attempt === retries) {
        throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// ✅ Internship application handler (Save to Google Sheets)
app.post('/api/submit-application', limiter, async (req, res) => {
  const data = req.body;

  try {
    console.log('📥 Received application submission:', {
      name: data.name,
      email: data.email,
      internship: data.internshipTitle,
    });

    // Validate required fields
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
      message: 'Application submitted successfully! We will contact you soon.',
    });

  } catch (err) {
    console.error('❌ Error in /api/submit-application:', err.message);
    res.status(500).json({ 
      success: false, 
      message: `Failed to submit application: ${err.message}` 
    });
  }
});

// ✅ Contact form handler (still sends emails)
app.post('/api/send-contact-email', limiter, async (req, res) => {
  const data = req.body;
  const userEmail = data.email;
  const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid contact email' });
    }

    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Thank You for Reaching Out, ${data.name}!</h2>
        <p>We've received your message at <strong>EDIZO</strong>. Our team will respond shortly.</p>
        <p>If urgent, contact: <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
        <p><strong>EDIZO Support Team</strong></p>
      </div>`;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
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
      sendMail(userEmail, `We've received your message`, userHtml),
      sendMail(adminEmail, `Contact Form - ${data.subject || 'New Inquiry'}`, adminHtml),
    ]);

    res.status(200).json({ success: true, message: '✅ Contact emails sent.' });
  } catch (err) {
    console.error('❌ Error in /api/send-contact-email:', err.message);
    res.status(500).json({ success: false, message: `Failed to send email: ${err.message}` });
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 Google Sheets integration: ENABLED');
  console.log('✉️ Email service: ENABLED (Contact form only)');
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('❌ SIGTERM received. Closing server...');
  transporter.close();
  process.exit(0);
});
