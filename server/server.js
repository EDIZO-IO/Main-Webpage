import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allowed frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'https://EDIZO-IO.github.io',
  'https://EDIZO-IO.github.io/Main-Webpage'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('CORS not allowed for this origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Email Sender
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

  if (!recipient) {
    throw new Error('Recipient email is missing.');
  }

  switch (type) {
    case 'applicationConfirmation': {
      finalSubject = `Application Confirmation - ${data.internshipTitle || 'Internship'}`;
      finalHtml = `
        <div style="font-family: Arial; color: #333;">
          <h2>Hi ${data.name},</h2>
          <p>Thank you for applying for <strong>${data.internshipTitle}</strong> at E.D.I.Z.O.</p>
          <p>We'll review your application and contact you shortly.</p>
          <p>Regards,<br/>E.D.I.Z.O Team</p>
        </div>`;
      break;
    }

    case 'internshipApplicationNotification': {
      recipient = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;
      finalSubject = `New Internship Application - ${data.internshipTitle}`;
      finalHtml = `
        <div style="font-family: Arial; color: #333;">
          <h2>New Application Received</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Education:</strong> ${data.education}</p>
          <p><strong>Experience:</strong><br/><pre>${data.experience}</pre></p>
          <p><strong>Message:</strong><br/><pre>${data.message}</pre></p>
        </div>`;
      break;
    }

    case 'contactForm': {
      recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;
      finalSubject = `Contact Form Submission - ${data.subject}`;
      finalHtml = `
        <div style="font-family: Arial; color: #333;">
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong><br/><pre>${data.message}</pre></p>
        </div>`;
      break;
    }

    case 'custom': {
      // Use as is
      break;
    }

    default: {
      finalSubject = subject || 'Notification';
      finalHtml = '<p>No content provided.</p>';
    }
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: finalSubject,
    html: finalHtml
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to: ${recipient} | Subject: "${finalSubject}"`);
}

// ✅ API: Send Internship Email
app.post('/send-email', async (req, res, next) => {
  try {
    await sendEmail(req.body);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ Email send failed:', err);
    next(err);
  }
});

// ✅ API: Contact Form Email
app.post('/send-contact-email', async (req, res, next) => {
  try {
    const recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;
    await sendEmail({
      ...req.body,
      type: 'contactForm',
      recipientEmail: recipient
    });
    res.status(200).json({ success: true, message: 'Contact form email sent!' });
  } catch (err) {
    console.error('❌ Contact form error:', err);
    next(err);
  }
});

// ✅ API: Test Email
app.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      type: 'custom',
      subject: 'Test Email from EDIZO',
      htmlContent: '<p>This is a test email from your server.</p>',
      recipientEmail: process.env.INTERNSHIP_RECIPIENT_EMAIL
    });
    res.send('✅ Test email sent.');
  } catch (err) {
    console.error('❌ Test email error:', err);
    res.status(500).send('❌ Failed to send test email.');
  }
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
