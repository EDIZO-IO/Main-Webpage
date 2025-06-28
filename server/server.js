import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables from a .env file

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allowed frontend URLs for CORS policy
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', // Added the new local development origin
  'https://EDIZO-IO.github.io',
  'https://EDIZO-IO.github.io/Main-Webpage'
];

// Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Check if the requesting origin is in the allowed list
    if (!allowedOrigins.includes(origin)) {
      const msg = 'CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Allow cookies to be sent with cross-origin requests
}));

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Email Sender Function
// This function centralizes the email sending logic using Nodemailer.
async function sendEmail({ type, recipientEmail, subject, htmlContent, ...data }) {
  // Create a Nodemailer transporter using Gmail service and authentication from environment variables
  // Ensure EMAIL_USER and EMAIL_PASS are set in your .env file
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address (e.g., your_email@gmail.com)
      pass: process.env.EMAIL_PASS   // Your Gmail app password (NOT your regular password)
    }
  });

  let finalSubject = subject || '';
  let finalHtml = htmlContent || '';
  let recipient = recipientEmail || data.email; // Prioritize recipientEmail, then fallback to data.email

  // Ensure a recipient email is provided
  if (!recipient) {
    throw new Error('Recipient email is missing for sending email.');
  }

  // Determine email content based on the 'type' of email
  switch (type) {
    case 'applicationConfirmation': {
      // Email sent to the applicant to confirm their submission
      finalSubject = `Application Confirmation - ${data.internshipTitle || 'Internship'}`;
      finalHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>Thank you for your Application, ${data.name}!</h2>
          <p>We have successfully received your application for the <strong>${data.internshipTitle}</strong> at <strong>E.D.I.Z.O.</strong>.</p>
          <p>Our team will review your application thoroughly and get in touch with you regarding the next steps.</p>
          <p>In the meantime, if you have any questions, please do not hesitate to contact us.</p>
          
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
          
          <h3>📱 Join Our WhatsApp Group</h3>
          <p>Stay updated about your internship by joining the official WhatsApp group:</p>
          <a href="https://chat.whatsapp.com/LhhLFD6pbil3NFImE30UIQ" target="_blank" style="display: inline-block; padding: 10px 15px; background-color: #25D366; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Join WhatsApp Group" width="20" style="vertical-align: middle; margin-right: 8px;" />
            Join WhatsApp Group
          </a>
          
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
          
          <p>Best regards,<br/><strong>The E.D.I.Z.O Team</strong></p>
        </div>
      `;
      break;
    }

    case 'internshipApplicationNotification': {
      // Email sent to the admin to notify about a new internship application
      // Ensure INTERNSHIP_RECIPIENT_EMAIL is set in your .env file
      recipient = process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER;
      finalSubject = `New Internship Application - ${data.internshipTitle}`;
      finalHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>New Internship Application Received</h2>
          <p>Details for <strong>${data.internshipTitle}</strong>:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li><strong>Education:</strong> ${data.education || 'N/A'}</li>
            <li><strong>Experience:</strong><br/><pre style="white-space: pre-wrap; background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #eee;">${data.experience || 'No relevant experience provided.'}</pre></li>
            <li><strong>Cover Letter/Message:</strong><br/><pre style="white-space: pre-wrap; background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #eee;">${data.message || 'No message provided.'}</pre></li>
          </ul>
        </div>`;
      break;
    }

    case 'contactForm': {
      // Email sent to the admin for contact form submissions
      // Ensure CONTACT_FORM_RECIPIENT_EMAIL is set in your .env file
      recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;
      finalSubject = `Contact Form Submission - ${data.subject || 'No Subject'}`;
      finalHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
          <p><strong>Message:</strong><br/><pre style="white-space: pre-wrap; background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #eee;">${data.message || 'No message provided.'}</pre></p>
        </div>`;
      break;
    }

    case 'custom': {
      // For custom email types, subject and htmlContent are used as provided
      break;
    }

    default: {
      // Fallback for unknown email types
      finalSubject = subject || 'General Notification';
      finalHtml = htmlContent || '<p>No specific content provided for this notification type.</p>';
    }
  }

  // Construct mail options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email address
    to: recipient, // Recipient email address
    subject: finalSubject, // Email subject
    html: finalHtml // HTML content of the email
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to: ${recipient} | Subject: "${finalSubject}"`);
}

// ✅ API Endpoint: Send Internship/Application Email
// This route handles both internship application confirmations and admin notifications.
app.post('/send-email', async (req, res, next) => {
  try {
    // Call the sendEmail function with the request body as data
    await sendEmail(req.body);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ Email send failed:', err);
    // Pass the error to the global error handler
    next(err);
  }
});

// ✅ API Endpoint: Send Contact Form Email
// This route specifically handles contact form submissions.
app.post('/send-contact-email', async (req, res, next) => {
  try {
    // The recipient for contact forms is typically a predefined admin email
    const recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_USER;
    await sendEmail({
      ...req.body, // Pass all data from the request body
      type: 'contactForm', // Specify email type
      recipientEmail: recipient // Explicitly set the recipient
    });
    res.status(200).json({ success: true, message: 'Contact form email sent successfully!' });
  } catch (err) {
    console.error('❌ Contact form email error:', err);
    next(err);
  }
});

// ✅ API Endpoint: Test Email
// A utility route to quickly test if email sending is configured correctly.
app.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      type: 'custom',
      subject: 'Test Email from EDIZO Backend',
      htmlContent: '<p>This is a test email sent from your EDIZO backend server. If you received this, email sending is configured correctly!</p>',
      recipientEmail: process.env.INTERNSHIP_RECIPIENT_EMAIL || process.env.EMAIL_USER // Send to the internship recipient or default user
    });
    res.send('✅ Test email sent. Check recipient inbox.');
  } catch (err) {
    console.error('❌ Test email error:', err);
    res.status(500).send('❌ Failed to send test email. Check server logs for details.');
  }
});

// ✅ Global Error Handler Middleware
// This catches any errors passed via next(err) from other routes.
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err); // Log the error for debugging
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred. Please try again.'
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/test-email in your browser to test email sending.`);
});
