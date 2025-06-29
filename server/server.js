import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://edizo-intern.netlify.app',
  'https://edizo-io.netlify.app',
  'https://main-webpage.netlify.app',
  'https://edizo.github.io',
  'https://edizo.github.io/Main-Webpage',
  'https://main-webpage-l85m.onrender.com',
];

// ✅ Optional wildcard for all Netlify preview links
const netlifyPattern = /^https:\/\/.*\.netlify\.app$/;

// ✅ Middleware: secure headers
app.use(helmet());

// ✅ Middleware: rate limiting (max 100 reqs per 15 mins)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// ✅ Middleware: CORS with safe fallback
app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 Incoming request from:', origin || 'undefined');

    if (
      !origin ||                                // allow undefined origin (curl, Postman)
      allowedOrigins.includes(origin) ||        // allow explicitly whitelisted origins
      netlifyPattern.test(origin)               // allow Netlify preview builds
    ) {
      callback(null, true);
    } else {
      console.warn('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Middleware: body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend is running.');
});

// ✅ Nodemailer transporter (Gmail App Password required)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Email utility
async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    text: html.replace(/<[^>]*>?/gm, ''),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${to}: ${info.messageId}`);
}

// ✅ /api/send-email → handles both applicant + admin notifications
app.post('/api/send-email', async (req, res, next) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!applicantEmail) throw new Error('Applicant email missing');

    // ✅ Email to applicant
    const applicantHtml = `
      <div style="font-family: Arial; color: #333;">
        <h2>Thank you for your Application, ${data.name}!</h2>
        <p>We’ve received your application for <strong>${data.internshipTitle}</strong> at <strong>E.D.I.Z.O.</strong>.</p>
        <p>We’ll review it and get in touch shortly.</p>
        <p><strong>Join WhatsApp Group:</strong></p>
        <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ">Join Now</a>
      </div>`;
    await sendMail(applicantEmail, `Application Confirmation - ${data.internshipTitle}`, applicantHtml);

    // ✅ Email to admin
    const adminHtml = `
      <div>
        <h2>New Internship Application</h2>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
          <li><strong>Education:</strong> ${data.education}</li>
          <li><strong>Experience:</strong> ${data.experience}</li>
          <li><strong>Message:</strong> ${data.message}</li>
        </ul>
      </div>`;
    await sendMail(adminEmail, `New Internship Application - ${data.internshipTitle}`, adminHtml);

    res.status(200).json({ success: true, message: 'Emails sent to applicant and admin.' });
  } catch (err) {
    console.error('❌ Error in /api/send-email:', err);
    next(err);
  }
});

// ✅ /api/send-contact-email → handles contact form
app.post('/api/send-contact-email', async (req, res, next) => {
  const data = req.body;
  const userEmail = data.email;
  const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!userEmail) throw new Error('User email missing');

    // ✅ Acknowledgment to user
    const userHtml = `
      <div>
        <h2>Thank you for contacting E.D.I.Z.O., ${data.name}!</h2>
        <p>We’ve received your message and will reply soon.</p>
      </div>`;
    await sendMail(userEmail, `We've received your message`, userHtml);

    // ✅ Notification to admin
    const adminHtml = `
      <div>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      </div>`;
    await sendMail(adminEmail, `Contact Form - ${data.subject || 'New Inquiry'}`, adminHtml);

    res.status(200).json({ success: true, message: 'Emails sent to user and admin.' });
  } catch (err) {
    console.error('❌ Error in /api/send-contact-email:', err);
    next(err);
  }
});

// ✅ /api/test-email → quick backend test
app.get('/api/test-email', async (req, res) => {
  try {
    await sendMail(
      process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER,
      'Test Email from EDIZO Backend',
      '<p>This is a test email. ✅ If you received this, email is working.</p>'
    );
    res.send('✅ Test email sent.');
  } catch (err) {
    console.error('❌ Error in /api/test-email:', err);
    res.status(500).send('❌ Test email failed.');
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
