import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Automatically whitelist known frontends for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://edizo-io.netlify.app',  // ✅ Netlify URL
  'https://main-webpage.netlify.app',
  'https://edizo.github.io',
  'https://edizo.github.io/Main-Webpage'
];

// ✅ Use CORS middleware with dynamic origin checking
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Email sender function (unchanged)
async function sendEmail({ type, recipientEmail, subject, htmlContent, ...data }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let finalSubject = subject || '';
  let finalHtml = htmlContent || '';
  let recipient = recipientEmail || data.email;

  if (!recipient) throw new Error('Recipient email is missing.');

  switch (type) {
    case 'applicationConfirmation':
      finalSubject = `Application Confirmation - ${data.internshipTitle || 'Internship'}`;
      finalHtml = `
        <div style="font-family: Arial; color: #333;">
          <h2>Thank you for your Application, ${data.name}!</h2>
          <p>We’ve received your application for <strong>${data.internshipTitle}</strong> at <strong>E.D.I.Z.O.</strong>.</p>
          <p>We’ll review it and get in touch shortly.</p>
          <p><strong>Join WhatsApp Group:</strong></p>
          <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ">Join Now</a>
        </div>
      `;
      break;

    case 'internshipApplicationNotification':
      recipient = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;
      finalSubject = `New Internship Application - ${data.internshipTitle}`;
      finalHtml = `
        <div>
          <h2>New Application Received</h2>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li><strong>Education:</strong> ${data.education}</li>
            <li><strong>Experience:</strong> ${data.experience}</li>
            <li><strong>Message:</strong> ${data.message}</li>
          </ul>
        </div>
      `;
      break;

    case 'contactForm':
      recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;
      finalSubject = `Contact Form Submission - ${data.subject || 'No Subject'}`;
      finalHtml = `
        <div>
          <h2>Contact Inquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
      `;
      break;

    default:
      finalSubject = subject || 'EDIZO Notification';
      finalHtml = htmlContent || '<p>No content provided.</p>';
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: finalSubject,
    html: finalHtml
  });

  console.log(`✅ Email sent to ${recipient} with subject "${finalSubject}"`);
}

// ✅ Application email handler
app.post('/send-email', async (req, res, next) => {
  try {
    await sendEmail(req.body);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ Email failed:', err);
    next(err);
  }
});

// ✅ Contact form email handler
app.post('/send-contact-email', async (req, res, next) => {
  try {
    await sendEmail({
      ...req.body,
      type: 'contactForm',
      recipientEmail: process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER
    });
    res.status(200).json({ success: true, message: 'Contact form sent successfully!' });
  } catch (err) {
    next(err);
  }
});

// ✅ Test email route
app.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      type: 'custom',
      recipientEmail: process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER,
      subject: 'Test Email',
      htmlContent: '<p>This is a test email from EDIZO backend.</p>'
    });
    res.send('✅ Test email sent.');
  } catch (err) {
    res.status(500).send('❌ Failed to send test email.');
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
