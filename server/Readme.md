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

// ✅ Nodemailer transport configuration
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
    text: html.replace(/<[^>]*>/g, ''), // basic fallback
  };
  

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
}

// ✅ Internship application handler
app.post('/api/send-email', limiter, async (req, res) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!applicantEmail || !/\S+@\S+\.\S+/.test(applicantEmail)) throw new Error('Invalid applicant email');

    const applicantHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Application Received – Thank You, ${data.name}!</h2>
      <p>
        Thank you for applying for the <strong>${data.internshipTitle}</strong> internship at <strong>E.D.I.Z.O.</strong>.
        We appreciate your interest and the time you invested in your application.
      </p>
      <p>Our recruitment team will carefully review your submission and contact you soon.</p>
      <p>
    In the meantime, we invite you to join our official WhatsApp group for updates and networking:
  </p>
      <p>Join our WhatsApp group for updates: 👉
        <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ">Join the E.D.I.Z.O. Group</a>
      </p>
      <p>
        Best regards,<br />
        <strong>The E.D.I.Z.O. Talent Team</strong><br />
        <em>Empowering Digital Innovators</em>
      </p>
    </div>`;

    const adminHtml = `
 <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>📥 New Internship Application Received</h2>
      <p><strong>Internship Position:</strong> ${data.internshipTitle}</p>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
        <li><strong>Education:</strong> ${data.education}</li>
        <li><strong>Experience:</strong> ${data.experience}</li>
        <li><strong>Message:</strong> ${data.message}</li>
      </ul>
      <p><strong>E.D.I.Z.O. Application System</strong></p>
    </div>`;
    await sendMail(applicantEmail, `Application Confirmation - ${data.internshipTitle}`, applicantHtml);
    await sendMail(adminEmail, `New Internship Application - ${data.internshipTitle}`, adminHtml);

    res.status(200).json({ success: true, message: '✅ Emails sent successfully.' });
  } catch (err) {
    console.error('❌ Error in /api/send-email:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Contact form handler
app.post('/api/send-contact-email', limiter, async (req, res) => {
  const data = req.body;
  const userEmail = data.email;
  const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) throw new Error('Invalid contact email');

    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Thank You for Reaching Out, ${data.name}!</h2>
      <p>
        We’ve received your message at <strong>E.D.I.Z.O.</strong>. Our team will respond shortly.
      </p>
      <p>If urgent, contact: <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
      <p><strong>E.D.I.Z.O. Support Team</strong></p>
    </div>`

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>📨 New Contact Form Submission</h2>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
        <li><strong>Subject:</strong> ${data.subject || 'N/A'}</li>
        <li><strong>Message:</strong> ${data.message}</li>
      </ul>
      <p>Submitted via the contact form on E.D.I.Z.O. website.</p>
    </div>`;
    await sendMail(userEmail, `We’ve received your message`, userHtml);
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
