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

// ✅ Optional wildcard for Netlify previews
const netlifyPattern = /^https:\/\/.*\.netlify\.app$/;

// ✅ Middleware setup
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 Incoming request from:', origin || 'undefined');
    if (!origin || allowedOrigins.includes(origin) || netlifyPattern.test(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ EDIZO Backend is running.');
});

// ✅ Configure mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send email utility
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

// ✅ Internship application handler
app.post('/api/send-email', async (req, res) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!applicantEmail) throw new Error('Applicant email missing');

    // ✅ Email to applicant
    const applicantHtml = `
  <div style="font-family: Arial, sans-serif; color: #333;">
  <h2>Application Received – Thank You, ${data.name}!</h2>
  <p>Dear ${data.name},</p>
  <p>
    Thank you for applying for the <strong>${data.internshipTitle}</strong> internship at <strong>E.D.I.Z.O.</strong>.
    We appreciate your interest and the time you invested in your application.
  </p>
  <p>
    Our recruitment team will carefully review your submission and contact you soon with the next steps if your profile aligns with our current openings.
  </p>
  <p>
    In the meantime, we invite you to join our official WhatsApp group for updates and networking:
  </p>
  <p>
    👉 <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ">Join the E.D.I.Z.O. Internship Group</a>
  </p>
  <p>
    Best regards,<br />
    <strong>The E.D.I.Z.O. Talent Team</strong><br />
    <em>Empowering Digital Innovators</em>
  </p>
</div>
`;
    await sendMail(applicantEmail, `Application Confirmation - ${data.internshipTitle}`, applicantHtml);

    // ✅ Email to admin
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
  <p>
    Please log into the admin dashboard to review the applicant profile in detail.
  </p>
  <p>
    <strong>E.D.I.Z.O. Application System</strong>
  </p>
</div>
`;
    await sendMail(adminEmail, `New Internship Application - ${data.internshipTitle}`, adminHtml);

    res.status(200).json({ success: true, message: '✅ Emails sent to applicant and admin.' });
  } catch (err) {
    console.error('❌ Error in /api/send-email:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send email.' });
  }
});

// ✅ Contact form email handler
app.post('/api/send-contact-email', async (req, res) => {
  const data = req.body;
  const userEmail = data.email;
  const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!userEmail) throw new Error('User email missing');

    // ✅ Email to user
    const userHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
  <h2>Thank You for Reaching Out, ${data.name}!</h2>
  <p>
    We’ve received your message and appreciate you contacting <strong>E.D.I.Z.O.</strong>.
    Our team will review your inquiry and respond to you shortly.
  </p>
  <p>
    If your query is urgent, feel free to email us directly at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.
  </p>
  <p>
    Best regards,<br />
    <strong>E.D.I.Z.O. Support Team</strong>
  </p>
</div>
`;
    await sendMail(userEmail, `We've received your message`, userHtml);

    // ✅ Email to admin
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
  <p>
    This message was submitted via the contact form on the official E.D.I.Z.O. website.
  </p>
</div>
`;
    await sendMail(adminEmail, `Contact Form - ${data.subject || 'New Inquiry'}`, adminHtml);

    res.status(200).json({ success: true, message: '✅ Contact emails sent to user and admin.' });
  } catch (err) {
    console.error('❌ Error in /api/send-contact-email:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send contact email.' });
  }
});

// ✅ Test route
app.get('/api/test-email', async (req, res) => {
  try {
    await sendMail(
      process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER,
      '✅ Test Email from EDIZO Backend',
      '<p>This is a test email. If you received it, everything works ✅</p>'
    );
    res.send('✅ Test email sent.');
  } catch (err) {
    console.error('❌ Error in /api/test-email:', err);
    res.status(500).send('❌ Test email failed.');
  }
});

// ✅ Global error fallback
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
