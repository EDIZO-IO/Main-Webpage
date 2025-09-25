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
      imgSrc: ["'self'", '', 'https:'],
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

// ✅ Internship application handler (UPDATED)
app.post('/api/send-email', limiter, async (req, res) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!applicantEmail || !/\S+@\S+\.\S+/.test(applicantEmail)) throw new Error('Invalid applicant email');
    
    // Normalize undefined price or period to 'N/A'
    const period = data.coursePeriod || 'N/A';
    const price = data.price ? `₹${data.price.toLocaleString()}` : 'N/A';

    const applicantHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin-bottom: 10px;">EDIZO</h1>
          <p style="color: #666; font-style: italic;">Empowering Digital Innovators</p>
        </div>
        
        <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Application Received – Thank You, ${data.name}!</h2>
        
        <p style="line-height: 1.6;">
          Thank you for applying for the <strong>${data.internshipTitle}</strong> internship at <strong>EDIZO</strong>.
          We appreciate your interest and the time you invested in your application.
        </p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">📋 Application Summary:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><strong>Course:</strong> ${data.internshipTitle}</li>
            <li style="margin-bottom: 8px;"><strong>Duration:</strong> ${period}</li>
            <li style="margin-bottom: 8px;"><strong>Investment:</strong> <span style="color: #059669; font-weight: bold;">${price}</span></li>
          </ul>
        </div>
        
        <p style="line-height: 1.6;">
          Our recruitment team will carefully review your submission and contact you within <strong>2-3 business days</strong>.
        </p>
        
        <div style="background-color: #dcfce7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; line-height: 1.6;">
            <strong>🚀 Next Steps:</strong><br>
            Join our official WhatsApp group for updates, networking, and important announcements:
          </p>
          <p style="text-align: center; margin: 15px 0;">
            <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ" 
               style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              📱 Join EDIZO WhatsApp Group
            </a>
          </p>
        </div>
        
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
          <h1 style="margin: 0; font-size: 24px;">📥 NEW INTERNSHIP APPLICATION</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">EDIZO Application System</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
          <h2 style="margin: 0 0 10px 0; color: #92400e;">🎯 ${data.internshipTitle}</h2>
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <span style="background-color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;">
              ⏱️ ${period}
            </span>
            <span style="background-color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; color: #059669;">
              💰 ${price}
            </span>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">👤 Applicant Information</h3>
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
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">University:</td>
              <td style="padding: 8px 0; color: #111827;">${data.university || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Year of Study:</td>
              <td style="padding: 8px 0; color: #111827;">${data.yearOfStudy || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Degree & Branch:</td>
              <td style="padding: 8px 0; color: #111827;">${data.education || 'N/A'}</td>
            </tr>
          </table>
        </div>
        
        ${data.academicExperience ? `
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">🎓 Academic Experience</h3>
          <p style="margin: 0; line-height: 1.6; color: #1f2937;">${data.academicExperience}</p>
        </div>
        ` : ''}
        
        ${data.message ? `
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
          <h3 style="color: #15803d; margin-top: 0;">💭 Cover Letter</h3>
          <p style="margin: 0; line-height: 1.6; color: #1f2937;">${data.message}</p>
        </div>
        ` : ''}
        
        <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Application received on ${new Date().toLocaleString('en-IN', { 
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
    
    await sendMail(applicantEmail, `✅ Application Confirmation - ${data.internshipTitle} Internship`, applicantHtml);
    await sendMail(adminEmail, `🚨 New Application: ${data.internshipTitle} - ${data.name}`, adminHtml);

    res.status(200).json({ success: true, message: '✅ Emails sent successfully.' });
  } catch (err) {
    console.error('❌ Error in /api/send-email:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Contact form handler - Updated to handle both general and service forms
app.post('/api/send-contact-email', limiter, async (req, res) => {
  const data = req.body;
  const userEmail = data.email;
  const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) throw new Error('Invalid contact email');

    // Determine form type and generate appropriate emails
    if (data.formType === 'service') {
      // Service requirement form
      const service = data.service || 'Service';
      const userHtml = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Thank You for Your Service Inquiry, ${data.name}!</h2>
          <p>
            We've received your service requirement for <strong>${service}</strong> at <strong>EDIZO</strong>. Our team will review your requirements and contact you shortly.
          </p>
          <p><strong>EDIZO Support Team</strong></p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
          <h3>Contact Information:</h3>
          <p><strong>Email:</strong> <a href="mailto:edizoofficial@gmail.com">edizoofficial@gmail.com</a></p>
          <p><strong>Phone:</strong> <a href="tel:+919876543210">+91 9876543210</a></p>
          <p><strong>Operating Hours:</strong> Mon-Sat: 9:00 AM - 6:00 PM (IST)</p>
          <p><strong>Website:</strong> <a href="https://www.edizo.in">www.edizo.in</a></p>
        </div>`;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>💼 New Service Requirement</h2>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Service Required:</strong> ${service}</li>
            <li><strong>Project Details:</strong> ${data.projectDetails || 'N/A'}</li>
            <li><strong>Timeline:</strong> ${data.timeline || 'N/A'}</li>
            <li><strong>Budget:</strong> ${data.budget || 'N/A'}</li>
          </ul>
          <p>Submitted via the service requirement form on EDIZO website.</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
          <h3>Company Contact Details:</h3>
          <p><strong>Email:</strong> <a href="mailto:edizoofficial@gmail.com">edizoofficial@gmail.com</a></p>
          <p><strong>Phone:</strong> <a href="tel:+919876543210">+91 9876543210</a></p>
          <p><strong>Operating Hours:</strong> Mon-Sat: 9:00 AM - 6:00 PM (IST)</p>
          <p><strong>Website:</strong> <a href="https://www.edizo.in">www.edizo.in</a></p>
        </div>`;
      
      await sendMail(userEmail, `Service Inquiry Confirmation - ${service}`, userHtml);
      await sendMail(adminEmail, `New Service Requirement: ${service} - ${data.name}`, adminHtml);
    } else {
      // General query form
      const userHtml = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Thank You for Reaching Out, ${data.name}!</h2>
          <p>
            We've received your message at <strong>EDIZO</strong>. Our team will respond shortly.
          </p>
          <p><strong>EDIZO Support Team</strong></p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
          <h3>Contact Information:</h3>
          <p><strong>Email:</strong> <a href="mailto:edizoofficial@gmail.com">edizoofficial@gmail.com</a></p>
          <p><strong>Phone:</strong> <a href="tel:+919876543210">+91 9876543210</a></p>
          <p><strong>Operating Hours:</strong> Mon-Sat: 9:00 AM - 6:00 PM (IST)</p>
          <p><strong>Website:</strong> <a href="https://www.edizo.in">www.edizo.in</a></p>
        </div>`;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>📨 New General Query</h2>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</li>
            <li><strong>Message:</strong> ${data.message}</li>
          </ul>
          <p>Submitted via the general query form on EDIZO website.</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
          <h3>Company Contact Details:</h3>
          <p><strong>Email:</strong> <a href="mailto:edizoofficial@gmail.com">edizoofficial@gmail.com</a></p>
          <p><strong>Phone:</strong> <a href="tel:+919876543210">+91 9876543210</a></p>
          <p><strong>Operating Hours:</strong> Mon-Sat: 9:00 AM - 6:00 PM (IST)</p>
          <p><strong>Website:</strong> <a href="https://www.edizo.in">www.edizo.in</a></p>
        </div>`;
      
      await sendMail(userEmail, `General Query Confirmation - ${data.subject || 'General Inquiry'}`, userHtml);
      await sendMail(adminEmail, `New General Query: ${data.subject || 'General Inquiry'} - ${data.name}`, adminHtml);
    }

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