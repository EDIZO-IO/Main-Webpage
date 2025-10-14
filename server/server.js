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
app.set('trust proxy', 1);

// ✅ Allowed origins list
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://edizo-intern.netlify.app',
  'https://edizo-io.netlify.app',
  'https://main-webpage.netlify.app',
  'https://edizo.github.io',
  'https://edizo.github.io/Main-Webpage',
  'https://main-webpage-l85m.onrender.com',
  'https://www.edizo.in',
  'https://edizo.in',
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
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend (Email Only) is running.');
});

// ✅ Nodemailer transport configuration
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
  logger: true,
  debug: true,
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

// ✅ Updated Internship application handler with enhanced details
app.post('/api/send-email', limiter, async (req, res) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!applicantEmail || !/\S+@\S+\.\S+/.test(applicantEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid applicant email' });
    }

    // Format data
    const period = data.coursePeriod || 'Not specified';
    const price = data.price ? `₹${data.price.toLocaleString('en-IN')}` : 'N/A';
    const internshipTitle = data.internshipTitle || 'EDIZO Internship';
    const company = data.company || 'EDIZO';
    const currentDate = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Enhanced applicant email
    const applicantHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              EDIZO
            </h1>
            <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">
              Empowering Digital Innovators
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              🎉 Application Received!
            </h2>
            
            <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
              Dear <strong>${data.name}</strong>,
            </p>
            
            <p style="color: #374151; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
              Thank you for applying to the <strong style="color: #dc2626;">${internshipTitle}</strong> internship at <strong>${company}</strong>. 
              We're excited about your interest and have successfully received your application!
            </p>
            
            <!-- Application Summary Card -->
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 10px; padding: 25px; margin: 0 0 25px 0; border-left: 5px solid #dc2626;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                📋 Application Summary
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Course:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; font-size: 14px;">
                    ${internshipTitle}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Company:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; font-size: 14px;">
                    ${company}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; font-size: 14px;">
                    ${period}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Program Fee:</td>
                  <td style="padding: 8px 0; color: #059669; font-weight: 700; text-align: right; font-size: 16px;">
                    ${price}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Applied On:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; font-size: 14px;">
                    ${currentDate} IST
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Next Steps -->
            <div style="background-color: #dcfce7; border-radius: 10px; padding: 20px; margin: 0 0 25px 0; border-left: 5px solid #22c55e;">
              <h3 style="color: #15803d; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                ✅ What Happens Next?
              </h3>
              <ul style="margin: 0; padding-left: 20px; color: #166534; line-height: 1.8; font-size: 14px;">
                <li>Our recruitment team will review your application within <strong>2-3 business days</strong></li>
                <li>You'll receive an email with next steps and interview details (if shortlisted)</li>
                <li>Join our WhatsApp community for updates and networking opportunities</li>
              </ul>
            </div>
            
            <!-- WhatsApp CTA -->
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #374151; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                📱 Stay Connected with EDIZO Community
              </p>
              <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ" 
                 style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3); transition: all 0.3s;">
                🚀 Join WhatsApp Group
              </a>
            </div>
            
            <!-- Additional Info -->
            <div style="background-color: #eff6ff; border-radius: 10px; padding: 20px; margin: 25px 0 0 0; border-left: 5px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <strong>💡 Pro Tip:</strong> Check your email regularly (including spam folder) for updates from EDIZO. 
                Add <strong>${process.env.EMAIL_USER}</strong> to your contacts to ensure delivery.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #374151; font-weight: 600; font-size: 14px;">
              Best regards,
            </p>
            <p style="margin: 0 0 4px 0; color: #dc2626; font-weight: 700; font-size: 16px;">
              The EDIZO Team
            </p>
            <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 13px; font-style: italic;">
              Building Tomorrow's Digital Leaders
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              Questions? Reply to this email or contact us at 
              <a href="mailto:${process.env.EMAIL_USER}" style="color: #dc2626; text-decoration: none;">
                ${process.env.EMAIL_USER}
              </a>
            </p>
          </div>
          
        </div>
      </body>
      </html>`;

    // Enhanced admin email
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 750px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Alert Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
              📥 NEW INTERNSHIP APPLICATION
            </h1>
            <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">
              EDIZO Application System
            </p>
          </div>
          
          <!-- Program Info Banner -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px 25px; border-bottom: 3px solid #f59e0b;">
            <h2 style="margin: 0 0 12px 0; color: #92400e; font-size: 22px; font-weight: 700;">
              🎯 ${internshipTitle}
            </h2>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
              <span style="background-color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 14px; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                ⏱️ ${period}
              </span>
              <span style="background-color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 14px; color: #059669; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                💰 ${price}
              </span>
              <span style="background-color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 14px; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                🏢 ${company}
              </span>
            </div>
          </div>
          
          <!-- Applicant Information -->
          <div style="padding: 25px;">
            <div style="background-color: #f9fafb; border-radius: 10px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
                👤 Applicant Information
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; width: 180px; color: #4b5563; font-size: 14px;">Full Name:</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 500;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px;">Email:</td>
                  <td style="padding: 10px 0;">
                    <a href="mailto:${data.email}" style="color: #dc2626; text-decoration: none; font-weight: 600; font-size: 15px;">
                      ${data.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px;">Phone:</td>
                  <td style="padding: 10px 0;">
                    ${data.phone ? `<a href="tel:${data.phone}" style="color: #dc2626; text-decoration: none; font-weight: 600; font-size: 15px;">${data.phone}</a>` : '<span style="color: #9ca3af; font-style: italic;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px;">University:</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 15px;">${data.university || '<span style="color: #9ca3af; font-style: italic;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px;">Year of Study:</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 15px;">${data.yearOfStudy || '<span style="color: #9ca3af; font-style: italic;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #4b5563; font-size: 14px;">Degree & Branch:</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 15px;">${data.education || '<span style="color: #9ca3af; font-style: italic;">Not provided</span>'}</td>
                </tr>
              </table>
            </div>
            
            ${data.academicExperience ? `
            <div style="background-color: #eff6ff; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                🎓 Academic Experience
              </h3>
              <p style="margin: 0; line-height: 1.7; color: #1f2937; font-size: 14px; white-space: pre-wrap;">
                ${data.academicExperience}
              </p>
            </div>
            ` : ''}
            
            ${data.message ? `
            <div style="background-color: #f0fdf4; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
              <h3 style="color: #15803d; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                💭 Cover Letter
              </h3>
              <p style="margin: 0; line-height: 1.7; color: #1f2937; font-size: 14px; white-space: pre-wrap;">
                ${data.message}
              </p>
            </div>
            ` : ''}
            
            <!-- Action Items -->
            <div style="background-color: #fef2f2; border-radius: 10px; padding: 20px; border-left: 4px solid #dc2626;">
              <h3 style="color: #991b1b; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                ⚡ Action Required
              </h3>
              <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; line-height: 1.8; font-size: 14px;">
                <li>Review application and candidate profile</li>
                <li>Schedule interview if qualified</li>
                <li>Send response within 2-3 business days</li>
                <li>Update candidate status in tracking system</li>
              </ul>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 2px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 13px;">
              Application received on <strong>${currentDate} IST</strong>
            </p>
            <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
              EDIZO Internship Management System
            </p>
          </div>
          
        </div>
      </body>
      </html>`;
    
    await Promise.all([
      sendMail(applicantEmail, `✅ Application Confirmed - ${internshipTitle}`, applicantHtml),
      sendMail(adminEmail, `🚨 New Application: ${internshipTitle} - ${data.name}`, adminHtml),
    ]);

    res.status(200).json({ success: true, message: '✅ Emails sent successfully.' });
  } catch (err) {
    console.error('❌ Error in /api/send-email:', err.message);
    res.status(500).json({ success: false, message: `Failed to send email: ${err.message}` });
  }
});

// ✅ Contact form handler (unchanged)
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
        <p>
          We've received your message at <strong>EDIZO</strong>. Our team will respond shortly.
        </p>
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
        <p>Submitted via the contact form on EDIZO website.</p>
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
