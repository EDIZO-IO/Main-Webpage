// server.js

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

// ✅ Allowed origins list (trailing spaces removed)
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

app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 Incoming request from:', origin || 'undefined');
    if (!origin || allowedOrigins.includes(origin) || netlifyPattern.test(origin)) {
      return callback(null, true);
    }
    console.warn('❌ Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Rate limiter (protect POST routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend is running.');
});

// ✅ Nodemailer transport configuration (FIXED)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Reusable sendMail function
async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    text: convert(html), // Use html-to-text for better text conversion
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
}

// ✅ Internship application handler (UPDATED UI)
app.post('/api/send-email', limiter, async (req, res) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!applicantEmail || !/\S+@\S+\.\S+/.test(applicantEmail)) throw new Error('Invalid applicant email');

    // Normalize undefined price or period to 'N/A'
    const period = data.coursePeriod || 'N/A';
    const price = data.price ? `₹${data.price.toLocaleString()}` : 'N/A';

    // --- Updated Applicant HTML ---
    const applicantHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Internship Application Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; color: #1f2937; line-height: 1.6;">
          <table width="100%" bgcolor="#f9fafb" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center" style="padding: 20px 0;">
                      <table width="100%" max-width="600px" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e5e7eb;">
                          <!-- Header -->
                          <tr>
                              <td align="center" bgcolor="#dc2626" style="padding: 30px 20px; color: white;">
                                  <h1 style="margin: 0; font-size: 28px; font-weight: 800;">EDIZO</h1>
                                  <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Empowering Digital Innovators</p>
                              </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                              <td style="padding: 30px;">
                                  <h2 style="margin-top: 0; color: #111827; font-size: 24px; font-weight: 700;">Application Received – Thank You, ${data.name}!</h2>

                                  <p style="margin: 20px 0;">
                                      Thank you for applying for the <strong style="color: #dc2626;">${data.internshipTitle}</strong> internship at <strong>EDIZO</strong>.
                                      We appreciate your interest and the time you invested in your application.
                                  </p>

                                  <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #f59e0b;">
                                      <h3 style="margin-top: 0; color: #92400e; font-size: 18px;">📋 Application Summary</h3>
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                          <tr>
                                              <td style="padding: 5px 0; font-weight: 600; width: 30%;">Course:</td>
                                              <td style="padding: 5px 0;">${data.internshipTitle}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 5px 0; font-weight: 600;">Duration:</td>
                                              <td style="padding: 5px 0;">${period}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 5px 0; font-weight: 600;">Investment:</td>
                                              <td style="padding: 5px 0; color: #059669; font-weight: 700;">${price}</td>
                                          </tr>
                                      </table>
                                  </div>

                                  <p style="margin: 20px 0;">
                                      Our recruitment team will carefully review your submission and contact you within <strong>2-3 business days</strong>.
                                  </p>

                                  <div style="background-color: #dcfce7; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center; border: 1px solid #bbf7d0;">
                                      <p style="margin: 0 0 15px 0; font-weight: 600; color: #15803d;">
                                          🚀 <strong>Next Steps:</strong> Join our official WhatsApp group for updates!
                                      </p>
                                      <!-- Trailing space removed from the link -->
                                      <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ"
                                         style="display: inline-block; background: linear-gradient(to right, #22c55e, #16a34a); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                          📱 Join EDIZO WhatsApp Group
                                      </a>
                                  </div>
                              </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                              <td style="padding: 20px; background-color: #f3f4f6; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
                                  <p style="margin: 0;">
                                      Best regards,<br />
                                      <strong style="color: #111827;">The EDIZO Team</strong><br />
                                      <em style="font-size: 13px;">Building Tomorrow's Digital Leaders</em>
                                  </p>
                                  <p style="margin: 15px 0 0 0; font-size: 12px;">
                                      Questions? Reply to this email or contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #dc2626; text-decoration: none;">${process.env.EMAIL_USER}</a>
                                  </p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>`;

    // --- Updated Admin HTML ---
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Internship Application</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; color: #1f2937; line-height: 1.6;">
          <table width="100%" bgcolor="#f9fafb" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center" style="padding: 20px 0;">
                      <table width="100%" max-width="700px" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e5e7eb;">
                          <!-- Header -->
                          <tr>
                              <td align="center" bgcolor="#dc2626" style="padding: 30px 20px; color: white;">
                                  <h1 style="margin: 0; font-size: 28px; font-weight: 800;">📥 NEW INTERNSHIP APPLICATION</h1>
                                  <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">EDIZO Application System</p>
                              </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                              <td style="padding: 30px;">
                                  <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
                                      <h2 style="margin: 0 0 12px 0; color: #1e40af; font-size: 22px;">🎯 ${data.internshipTitle}</h2>
                                      <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                                          <span style="background-color: #eff6ff; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; color: #1e40af; border: 1px solid #93c5fd;">
                                              ⏱️ ${period}
                                          </span>
                                          <span style="background-color: #ecfdf5; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; color: #059669; border: 1px solid #6ee7b7;">
                                              💰 ${price}
                                          </span>
                                      </div>
                                  </div>

                                  <div style="background-color: #f3f4f6; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #d1d5db;">
                                      <h3 style="margin-top: 0; color: #374151; font-size: 18px; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">👤 Applicant Information</h3>
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 15px;">
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; width: 35%; color: #4b5563;">Full Name:</td>
                                              <td style="padding: 8px 0; color: #111827;">${data.name}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Email:</td>
                                              <td style="padding: 8px 0; color: #111827;">
                                                  <a href="mailto:${data.email}" style="color: #dc2626; text-decoration: none; font-weight: 500;">${data.email}</a>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Phone:</td>
                                              <td style="padding: 8px 0; color: #111827;">
                                                  ${data.phone ? `<a href="tel:${data.phone}" style="color: #dc2626; text-decoration: none; font-weight: 500;">${data.phone}</a>` : 'N/A'}
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">University:</td>
                                              <td style="padding: 8px 0; color: #111827;">${data.university || 'N/A'}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Year of Study:</td>
                                              <td style="padding: 8px 0; color: #111827;">${data.yearOfStudy || 'N/A'}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Degree & Branch:</td>
                                              <td style="padding: 8px 0; color: #111827;">${data.education || 'N/A'}</td>
                                          </tr>
                                      </table>
                                  </div>

                                  ${data.academicExperience ? `
                                  <div style="background-color: #f0f9ff; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #0ea5e9;">
                                      <h3 style="margin-top: 0; color: #0c4a6e; font-size: 18px;">🎓 Academic Experience</h3>
                                      <p style="margin: 0; line-height: 1.6; color: #0f172a;">${data.academicExperience}</p>
                                  </div>
                                  ` : ''}

                                  ${data.message ? `
                                  <div style="background-color: #f0fdf4; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #22c55e;">
                                      <h3 style="margin-top: 0; color: #15803d; font-size: 18px;">💭 Cover Letter</h3>
                                      <p style="margin: 0; line-height: 1.6; color: #0f172a;">${data.message}</p>
                                  </div>
                                  ` : ''}

                                  <div style="text-align: right; color: #6b7280; font-size: 13px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                                      Application received on ${new Date().toLocaleString('en-IN', {
                                        timeZone: 'Asia/Kolkata',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })} IST
                                  </div>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>`;

    await sendMail(applicantEmail, `✅ Application Confirmation - ${data.internshipTitle} Internship`, applicantHtml);
    await sendMail(adminEmail, `🚨 New Application: ${data.internshipTitle} - ${data.name}`, adminHtml);

    res.status(200).json({ success: true, message: '✅ Emails sent successfully.' });
  } catch (err) {
    console.error('❌ Error in /api/send-email:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Contact form handler (UI Updated)
app.post('/api/send-contact-email', limiter, async (req, res) => {
  const data = req.body;
  const userEmail = data.email;
  const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) throw new Error('Invalid contact email');

    // --- Updated User HTML ---
    const userHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; color: #1f2937; line-height: 1.6;">
          <table width="100%" bgcolor="#f9fafb" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center" style="padding: 20px 0;">
                      <table width="100%" max-width="600px" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e5e7eb;">
                          <!-- Header -->
                          <tr>
                              <td align="center" bgcolor="#dc2626" style="padding: 30px 20px; color: white;">
                                  <h1 style="margin: 0; font-size: 28px; font-weight: 800;">EDIZO</h1>
                                  <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">We've Got Your Message!</p>
                              </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                              <td style="padding: 30px;">
                                  <h2 style="margin-top: 0; color: #111827; font-size: 24px;">Thank You, ${data.name}!</h2>

                                  <p style="margin: 20px 0;">
                                      We've received your message at <strong>EDIZO</strong>. Our team will respond shortly.
                                  </p>

                                  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #9ca3af;">
                                      <h3 style="margin-top: 0; color: #374151; font-size: 18px;">📩 Message Summary</h3>
                                      <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
                                      <p style="margin: 5px 0;"><strong>Message:</strong></p>
                                      <p style="margin: 5px 0; padding: 10px; background-color: #e5e7eb; border-radius: 5px;">${data.message}</p>
                                  </div>

                                  <p style="margin: 20px 0;">
                                      If urgent, contact us directly: <a href="mailto:${process.env.EMAIL_USER}" style="color: #dc2626; text-decoration: none; font-weight: 500;">${process.env.EMAIL_USER}</a>
                                  </p>

                                  <p style="margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                                      <strong>EDIZO Support Team</strong>
                                  </p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>`;

    // --- Updated Admin HTML for Contact ---
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; color: #1f2937; line-height: 1.6;">
          <table width="100%" bgcolor="#f9fafb" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center" style="padding: 20px 0;">
                      <table width="100%" max-width="600px" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e5e7eb;">
                          <!-- Header -->
                          <tr>
                              <td align="center" bgcolor="#dc2626" style="padding: 30px 20px; color: white;">
                                  <h1 style="margin: 0; font-size: 28px; font-weight: 800;">📨 New Contact Form Submission</h1>
                              </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                              <td style="padding: 30px;">
                                  <div style="background-color: #f3f4f6; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #d1d5db;">
                                      <h3 style="margin-top: 0; color: #374151; font-size: 18px; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">👤 Sender Information</h3>
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 15px;">
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; width: 30%; color: #4b5563;">Name:</td>
                                              <td style="padding: 8px 0; color: #111827;">${data.name}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Email:</td>
                                              <td style="padding: 8px 0; color: #111827;">
                                                  <a href="mailto:${data.email}" style="color: #dc2626; text-decoration: none; font-weight: 500;">${data.email}</a>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Phone:</td>
                                              <td style="padding: 8px 0; color: #111827;">
                                                  ${data.phone ? `<a href="tel:${data.phone}" style="color: #dc2626; text-decoration: none; font-weight: 500;">${data.phone}</a>` : 'N/A'}
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Subject:</td>
                                              <td style="padding: 8px 0; color: #111827;">${data.subject || 'N/A'}</td>
                                          </tr>
                                      </table>
                                  </div>

                                  <div style="background-color: #f0fdf4; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #22c55e;">
                                      <h3 style="margin-top: 0; color: #15803d; font-size: 18px;">💬 Message</h3>
                                      <p style="margin: 0; line-height: 1.6; color: #0f172a;">${data.message}</p>
                                  </div>

                                  <div style="text-align: right; color: #6b7280; font-size: 13px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                                      Submitted on ${new Date().toLocaleString('en-IN', {
                                        timeZone: 'Asia/Kolkata',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })} IST
                                  </div>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>`;

    await sendMail(userEmail, `We've received your message`, userHtml);
    await sendMail(adminEmail, `Contact Form - ${data.subject || 'New Inquiry'}`, adminHtml);

    res.status(200).json({ success: true, message: '✅ Contact emails sent.' });
  } catch (err) {
    console.error('❌ Error in /api/send-contact-email:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});