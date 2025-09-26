// server.js (updated)
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

// ✅ Enable trust proxy for proper handling of X-Forwarded-For header
app.set('trust proxy', 1); // Trust the first proxy (e.g., Render's load balancer)

// ✅ Allowed origins list
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://edizo-intern.netlify.app  ',
  'https://edizo-io.netlify.app  ',
  'https://main-webpage.netlify.app  ',
  'https://edizo.github.io  ',
  'https://edizo.github.io/Main-Webpage  ',
  'https://main-webpage-l85m.onrender.com  ',
  'https://www.edizo.in  ',
  'https://edizo.in  ',
];
const netlifyPattern = /^https:\/\/.*\.netlify\.app$/;

// ✅ Global middleware
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

// ✅ Rate limiter (protect POST routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend is running.');
});

// ✅ Nodemailer transport configuration with pooling
const transporter = nodemailer.createTransport({
  pool: true, // Enable connection pooling
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  maxConnections: 5, // Limit concurrent connections
  maxMessages: 10, // Limit messages per connection
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
  logger: true, // Enable logging for debugging
  debug: true, // Detailed debug output
});

// ✅ Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer verification failed:', error.message);
  } else {
    console.log('✅ Nodemailer is ready to send emails.');
  }
});

// ✅ Reusable sendMail function with retry logic
async function sendMail(to, subject, html, retries = 3) {
  const mailOptions = {
    from: `"EDIZO Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text: convert(html, { wordwrap: 130 }), // Improved text conversion
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
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// ✅ Checkout form handler
app.post('/api/send-checkout-email', limiter, async (req, res) => {
  const data = req.body;
  const clientEmail = data.email;
  const adminEmail = process.env.CHECKOUT_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!clientEmail || !/\S+@\S+\.\S+/.test(clientEmail)) {
      throw new Error('Invalid client email');
    }

    // Format selected plans for email
    const planList = Object.keys(data.selectedPlans).map(key => {
      const [serviceIndex, planIndex] = key.split('-').map(Number);
      const service = ['Web Development', 'App Development', 'UI/UX Design', 'Video Editing', 'Graphic Design', 'API Development'][serviceIndex];
      const plan = ['Basic', 'Standard', 'Advanced'][planIndex];
      return `${service} - ${plan}`;
    }).join('<br>');

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin-bottom: 10px;">EDIZO</h1>
          <p style="color: #666; font-style: italic;">Empowering Digital Innovators</p>
        </div>
        
        <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Service Request Received – Thank You, ${data.name}!</h2>
        
        <p style="line-height: 1.6;">
          Thank you for your service request with <strong>EDIZO</strong>.
          We appreciate your interest and the time you invested in your request.
        </p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">📋 Request Summary:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><strong>Services:</strong> ${planList.replace(/<br>/g, ', ')}</li>
            <li style="margin-bottom: 8px;"><strong>Total Investment:</strong> <span style="color: #059669; font-weight: bold;">₹${data.finalPrice.toLocaleString()}</span></li>
          </ul>
        </div>
        
        <p style="line-height: 1.6;">
          Our team will review your requirements and contact you within <strong>24 hours</strong> to discuss project details and next steps.
        </p>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="margin: 0; color: #666;">
            Best regards,<br />
            <strong>The EDIZO Team</strong><br />
            <em>Building Tomorrow's Digital Leaders</em>
          </p>
          <p style="font-size: 12px; color: #999; margin-top: 15px;">
            Questions? Reply to this email or contact us at ${process.env.EMAIL_USER}
          </p>
        </div>
      </div>`;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px; background-color: #dc2626; color: white; padding: 20px; border-radius: 6px;">
          <h1 style="margin: 0; font-size: 24px;">📥 NEW SERVICE REQUEST</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">EDIZO Checkout System</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
          <h2 style="margin: 0 0 10px 0; color: #92400e;">🎯 Service Request Details</h2>
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <span style="background-color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; color: #059669;">
              💰 Total: ₹${data.finalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">👤 Client Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 200px; color: #4b5563;">Full Name:</td>
              <td style="padding: 8px 0; color: #111827;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email:</td>
              <td style="padding: 8px 0; color: #111827;">
                <a href="mailto:${data.email}" style="color: #dc2626; text-decoration: none;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Phone:</td>
              <td style="padding: 8px 0; color: #111827;">
                ${data.phone ? `<a href="tel:${data.phone}" style="color: #dc2626; text-decoration: none;">${data.phone}</a>` : 'N/A'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Company:</td>
              <td style="padding: 8px 0; color: #111827;">${data.company || 'N/A'}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">📦 Selected Services</h3>
          <ul style="margin: 0; line-height: 1.6; color: #1f2937; padding-left: 20px;">
            ${planList.split('<br>').map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        ${data.message ? `
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
          <h3 style="color: #15803d; margin-top: 0;">📋 Project Requirements</h3>
          <p style="margin: 0; line-height: 1.6; color: #1f2937;">${data.message}</p>
        </div>
        ` : ''}
        
        <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Request received on ${new Date().toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} IST
          </p>
        </div>
      </div>`;
    
    await Promise.all([
      sendMail(clientEmail, `✅ Service Request Confirmation - EDIZO`, clientHtml),
      sendMail(adminEmail, `🚨 New Service Request - ${data.name}`, adminHtml),
    ]);

    res.status(200).json({ success: true, message: '✅ Emails sent successfully.' });
  } catch (err) {
    console.error('❌ Error in /api/send-checkout-email:', err.message);
    res.status(500).json({ success: false, message: `Failed to send email: ${err.message}` });
  }
});

// ✅ Internship application handler (existing)
app.post('/api/send-email', limiter, async (req, res) => {
  // ... existing code ...
});

// ✅ Contact form handler (existing)
app.post('/api/send-contact-email', limiter, async (req, res) => {
  // ... existing code ...
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('❌ SIGTERM received. Closing server...');
  transporter.close();
  process.exit(0);
});