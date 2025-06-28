import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allowed frontend URLs for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://EDIZO-IO.github.io',
  'https://EDIZO-IO.github.io/Main-Webpage'
];

// Configure CORS for allowed origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Email Sender Function
/**
 * Sends an email using Nodemailer.
 * @param {object} options - Email options.
 * @param {string} options.type - Type of email (e.g., 'applicationConfirmation', 'internshipApplicationNotification', 'contactForm', 'custom').
 * @param {string} [options.recipientEmail] - Explicit recipient email address.
 * @param {string} [options.subject] - Email subject for custom types.
 * @param {string} [options.htmlContent] - HTML content for custom types.
 * @param {object} data - Additional data relevant to the email type.
 */
async function sendEmail({ type, recipientEmail, subject, htmlContent, ...data }) {
  // Create a Nodemailer transporter using Gmail service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail email address
      pass: process.env.EMAIL_PASS  // Your Gmail app password (NOT your regular password)
    }
  });

  let finalSubject = subject || '';
  let finalHtml = htmlContent || '';
  let recipient = recipientEmail || data.email; // Default recipient from data.email if recipientEmail is not provided

  // Enhanced logging for debugging recipient email
  console.log(`✉️ Attempting to send email of type: ${type}`);
  console.log(`Initial recipient for email: ${recipient}`);
  console.log(`Process ENV Internship Recipient: ${process.env.INTERNSHIP_RECIPIENT_EMAIL}`);
  console.log(`Process ENV Contact Form Recipient: ${process.env.CONTACT_FORM_RECIPIENT_EMAIL}`);
  console.log(`Process ENV Email User: ${process.env.EMAIL_USER}`);


  // Validate recipient email
  if (!recipient && (type === 'applicationConfirmation' || type === 'custom')) {
    throw new Error('Recipient email is missing for confirmation or custom email types.');
  }

  // Logic to determine subject, HTML content, and final recipient based on email type
  switch (type) {
    case 'applicationConfirmation': {
      finalSubject = `Application Confirmation - ${data.internshipTitle || 'Internship'}`;
      finalHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #E53E3E; text-align: center;">Thank you for your Application, ${data.name}!</h2>
          <p>We have successfully received your application for the <strong>${data.internshipTitle}</strong> at <strong>E.D.I.Z.O.</strong>.</p>
          <p>Our team will review your application thoroughly and get in touch with you regarding the next steps within a few business days.</p>
          <p>In the meantime, if you have any questions, please do not hesitate to contact us.</p>
          
          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />
          
          <h3 style="color: #4A5568;">📱 Join Our WhatsApp Community</h3>
          <p>Stay updated about your internship process and connect with other applicants by joining our official WhatsApp group:</p>
          <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ" target="_blank" style="display: inline-flex; align-items: center; background-color: #25D366; color: white; padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: bold;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon" width="24" height="24" style="vertical-align: middle; margin-right: 10px;" />
            Join WhatsApp Group
          </a>
          
          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />
          
          <p style="text-align: center; color: #718096; font-size: 0.9em;">Best regards,<br/><strong>The E.D.I.Z.O Team</strong></p>
        </div>
      `;
      break;
    }

    case 'internshipApplicationNotification': {
      // Ensure the recipient is explicitly the admin email from environment variables
      recipient = process.env.INTERNSHIP_RECIPIENT_EMAIL;
      if (!recipient) {
        // Fallback to EMAIL_USER if specific recipient is not set for admin
        console.warn('❌ INTERNSHIP_RECIPIENT_EMAIL is not set. Falling back to EMAIL_USER for admin notification.');
        recipient = process.env.EMAIL_USER;
      }
      if (!recipient) {
         throw new Error('INTERNSHIP_RECIPIENT_EMAIL or EMAIL_USER is not configured for admin notification.');
      }

      finalSubject = `New Internship Application - ${data.internshipTitle || 'Unknown Internship'}`;
      finalHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #E53E3E; text-align: center;">🎉 New Internship Application Received!</h2>
          <p>A new application has been submitted for the <strong>${data.internshipTitle}</strong> internship.</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px dashed #ddd;" />
          <h3 style="color: #4A5568;">Applicant Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><strong>Name:</strong> ${data.name}</li>
            <li style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">${data.email}</a></li>
            <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li style="margin-bottom: 8px;"><strong>Education:</strong> ${data.education || 'N/A'}</li>
            <li style="margin-bottom: 8px;"><strong>Relevant Experience:</strong><br/><pre style="background-color: #f8f8f8; padding: 10px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; word-break: break-word;">${data.experience || 'Not provided'}</pre></li>
            <li style="margin-bottom: 8px;"><strong>Cover Letter/Message:</strong><br/><pre style="background-color: #f8f8f8; padding: 10px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; word-break: break-word;">${data.message || 'Not provided'}</pre></li>
          </ul>
          <hr style="margin: 20px 0; border: 0; border-top: 1px dashed #ddd;" />
          <p style="font-size: 0.9em; color: #718096; text-align: center;">Please review this application promptly.</p>
        </div>`;
      break;
    }

    case 'contactForm': {
      // Ensure the recipient is explicitly the contact form recipient email from environment variables
      recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL;
      if (!recipient) {
        // Fallback to EMAIL_USER if specific recipient is not set for contact form
        console.warn('❌ CONTACT_FORM_RECIPIENT_EMAIL is not set. Falling back to EMAIL_USER for contact form notification.');
        recipient = process.env.EMAIL_USER;
      }
      if (!recipient) {
        throw new Error('CONTACT_FORM_RECIPIENT_EMAIL or EMAIL_USER is not configured for contact form notification.');
      }

      finalSubject = `Contact Form Submission - ${data.subject || 'No Subject'}`;
      finalHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #4A5568; text-align: center;">New Contact Form Submission</h2>
          <p>You have received a new message from your website contact form.</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px dashed #ddd;" />
          <h3 style="color: #4A5568;">Message Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><strong>Name:</strong> ${data.name || 'N/A'}</li>
            <li style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">${data.email || 'N/A'}</a></li>
            <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li style="margin-bottom: 8px;"><strong>Subject:</strong> ${data.subject || 'N/A'}</li>
            <li style="margin-bottom: 8px;"><strong>Message:</strong><br/><pre style="background-color: #f8f8f8; padding: 10px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; word-break: break-word;">${data.message || 'Not provided'}</pre></li>
          </ul>
          <hr style="margin: 20px 0; border: 0; border-top: 1px dashed #ddd;" />
          <p style="font-size: 0.9em; color: #718096; text-align: center;">Please respond to this inquiry as soon as possible.</p>
        </div>`;
      break;
    }

    case 'custom': {
      // For 'custom' type, `subject` and `htmlContent` are expected directly.
      // `recipient` should also be explicitly provided in `options.recipientEmail`.
      if (!subject || !htmlContent || !recipient) {
        throw new Error('Subject, HTML content, and recipient email are required for custom email type.');
      }
      break; // No changes to finalSubject, finalHtml, recipient as they are directly passed
    }

    default: {
      console.warn(`⚠️ Unknown email type: ${type}. Sending a generic notification.`);
      finalSubject = subject || 'Generic Notification from E.D.I.Z.O.';
      finalHtml = htmlContent || '<p>This is a generic email notification from your server.</p>';
      if (!recipient) {
        console.warn('No specific recipient provided for generic email. Falling back to EMAIL_USER.');
        recipient = process.env.EMAIL_USER;
      }
      if (!recipient) {
         throw new Error('Recipient is not defined for generic email.');
      }
    }
  }

  // Final check for recipient before sending
  if (!recipient) {
    throw new Error('Final recipient email address is undefined. Cannot send email.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to: recipient,                 // Final determined recipient
    subject: finalSubject,         // Final determined subject
    html: finalHtml                // Final determined HTML content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${recipient} | Subject: "${finalSubject}"`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${recipient} with subject "${finalSubject}". Error:`, error);
    // Re-throw to be caught by the express error handler
    throw error;
  }
}

// ✅ API: Send Internship Email (handles both applicant confirmation and admin notification)
app.post('/send-email', async (req, res, next) => {
  try {
    await sendEmail(req.body);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ API Error: /send-email failed.', err);
    next(err); // Pass error to global error handler
  }
});

// ✅ API: Contact Form Email
app.post('/send-contact-email', async (req, res, next) => {
  try {
    // The sendEmail function will internally determine the recipient based on 'contactForm' type
    await sendEmail({ ...req.body, type: 'contactForm' });
    res.status(200).json({ success: true, message: 'Contact form email sent!' });
  } catch (err) {
    console.error('❌ API Error: /send-contact-email failed.', err);
    next(err); // Pass error to global error handler
  }
});

// ✅ API: Test Email Endpoint (for quick testing of email configuration)
app.get('/test-email', async (req, res, next) => {
  try {
    const testRecipient = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;
    if (!testRecipient) {
      return res.status(400).send('Error: INTERNSHIP_RECIPIENT_EMAIL or EMAIL_USER not set for test email.');
    }
    await sendEmail({
      type: 'custom',
      subject: 'Test Email from EDIZO Backend',
      htmlContent: '<p>This is a <strong>test email</strong> sent successfully from your EDIZO backend server.</p><p>If you received this, your email configuration is likely working!</p>',
      recipientEmail: testRecipient
    });
    res.send('✅ Test email sent to INTERNSHIP_RECIPIENT_EMAIL or EMAIL_USER successfully.');
  } catch (err) {
    console.error('❌ API Error: /test-email failed.', err);
    next(err); // Pass error to global error handler
  }
});

// ✅ Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err); // Log the full error for debugging
  const statusCode = err.status || 500;
  const message = err.message || 'An unexpected server error occurred.';

  res.status(statusCode).json({
    success: false,
    message: message,
    // In production, you might not want to send error.stack to the client
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
