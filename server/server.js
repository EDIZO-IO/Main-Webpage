import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://edizo-io.netlify.app',
  'https://main-webpage.netlify.app',
  'https://edizo.github.io',
  'https://edizo.github.io/Main-Webpage'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Utility: send single email
async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    text: html.replace(/<[^>]*>?/gm, '') // Fallback plain text
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${to}: ${info.messageId}`);
}

// ✅ Internship application handler
app.post('/send-email', async (req, res, next) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!applicantEmail) throw new Error('Applicant email missing');

    // 1. Send confirmation email to applicant
    const applicantHtml = `
      <div style="font-family: Arial; color: #333;">
        <h2>Thank you for your Application, ${data.name}!</h2>
        <p>We’ve received your application for <strong>${data.internshipTitle}</strong> at <strong>E.D.I.Z.O.</strong>.</p>
        <p>We’ll review it and get in touch shortly.</p>
        <p><strong>Join WhatsApp Group:</strong></p>
        <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ">Join Now</a>
      </div>`;
    await sendMail(applicantEmail, `Application Confirmation - ${data.internshipTitle}`, applicantHtml);

    // 2. Send notification to admin
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
    console.error('❌ Error in /send-email:', err);
    next(err);
  }
});

// ✅ Contact form email handler
app.post('/send-contact-email', async (req, res, next) => {
  const data = req.body;
  const userEmail = data.email;
  const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;

  try {
    if (!userEmail) throw new Error('User email missing');

    // 1. Send acknowledgment to user
    const userHtml = `
      <div>
        <h2>Thank you for contacting E.D.I.Z.O., ${data.name}!</h2>
        <p>We’ve received your message and will reply soon.</p>
      </div>`;
    await sendMail(userEmail, `We've received your message`, userHtml);

    // 2. Send message to admin
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
    console.error('❌ Error in /send-contact-email:', err);
    next(err);
  }
});

// ✅ Test endpoint
app.get('/test-email', async (req, res) => {
  try {
    await sendMail(
      process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER,
      'Test Email from EDIZO Backend',
      '<p>This is a test email. ✅ If you received this, email is working.</p>'
    );
    res.send('✅ Test email sent.');
  } catch (err) {
    res.status(500).send('❌ Test email failed.');
  }
});

// ✅ Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
