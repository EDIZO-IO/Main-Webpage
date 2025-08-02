// server.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limiter'; // Corrected import for rate-limiter
import { convert } from 'html-to-text';
import mongoose from 'mongoose'; // Import Mongoose

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 3001; // Updated from process.env.PORT

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
    user: 'edizocorp@gmail.com', // Updated from process.env.EMAIL_USER
    pass: 'tmqk suos feop ahjv', // Updated from process.env.EMAIL_PASS
  },
});

// ✅ Reusable sendMail function
async function sendMail(to, subject, html) {
  const mailOptions = {
    from: 'edizocorp@gmail.com', // Updated from process.env.EMAIL_USER
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

// ✅ Internship application handler
app.post('/api/send-email', limiter, async (req, res) => {
  const data = req.body;
  const applicantEmail = data.email;
  const adminEmail = 'edizocorp@gmail.com'; // Updated from process.env.INTERNSHIP_RECIPIENT_EMAIL

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
        <li><strong>University/College Name:</strong> ${data.university || 'N/A'}</li>
        <li><strong>Current Year of Study:</strong> ${data.yearOfStudy || 'N/A'}</li>
        <li><strong>Degree and Branch:</strong> ${data.education || 'N/A'}</li>
        <li><strong>Academic Projects / Relevant Experience:</strong> ${data.academicExperience || 'N/A'}</li>
        <li><strong>Cover Letter:</strong> ${data.message || 'N/A'}</li>
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
  const adminEmail = 'edizocorp@gmail.com'; // Updated from process.env.CONTACT_FORM_RECIPIENT_EMAIL

  try {
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) throw new Error('Invalid contact email');

    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Thank You for Reaching Out, ${data.name}!</h2>
      <p>
        We’ve received your message at <strong>E.D.I.Z.O.</strong>. Our team will respond shortly.
      </p>
      <p>If urgent, contact: <a href="mailto:edizocorp@gmail.com">edizocorp@gmail.com</a></p>
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

// --- MongoDB Connection and Certificate API Routes ---

// MongoDB Connection URI
const MONGODB_URI = 'mongodb+srv://eoxcgarun:eoxcgarun1432@cluster0.w2ikqp1.mongodb.net/'; // Updated from process.env.MONGODB_URI

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Certificate Schema
const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    companyName: { // New field: Company Name
        type: String,
        required: true,
        trim: true,
    },
    internName: { // Corresponds to Student Name
        type: String,
        required: true,
        trim: true,
    },
    batchRollNo: { // New field: Batch Roll Number
        type: String,
        required: false, // Made optional, adjust as per your requirement
        trim: true,
    },
    year: { // New field: Year (e.g., year of completion or batch year)
        type: Number,
        required: true,
    },
    programName: { // Corresponds to Internship Name
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now, // Automatically set issue date if not provided
    },
    status: {
        type: String,
        enum: ['Completed', 'In Progress', 'Cancelled'], // Enforce specific values
        default: 'Completed',
    },
});

// Create Certificate Model from the schema
const Certificate = mongoose.model('Certificate', certificateSchema);

// API Routes for Certificates

// 1. Route to ADD a new certificate (for initial data population/admin use)
app.post('/api/certificates', async (req, res) => {
    try {
        const newCertificate = new Certificate(req.body);
        await newCertificate.save();
        res.status(201).json({ message: 'Certificate added successfully', certificate: newCertificate });
    } catch (error) {
        console.error('Error adding certificate:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Certificate ID already exists.' });
        }
        res.status(500).json({ message: 'Failed to add certificate', error: error.message });
    }
});

// 2. Route to GET a certificate by its ID (for verification page)
app.get('/api/certificates/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;
        const certificate = await Certificate.findOne({ certificateId: certificateId });

        if (!certificate) {
            return res.status(404).json({ isValid: false, message: 'Certificate not found.' });
        }

        res.status(200).json({ isValid: true, data: certificate });
    } catch (error) {
        console.error('Error fetching certificate:', error);
        res.status(500).json({ message: 'Server error during verification', error: error.message });
    }
});

// 3. Route to UPDATE a certificate by its ID
app.put('/api/certificates/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;
        const updates = req.body;

        const updatedCertificate = await Certificate.findOneAndUpdate(
            { certificateId: certificateId },
            { $set: updates },
            { new: true, runValidators: true } // Return updated doc and run schema validators
        );

        if (!updatedCertificate) {
            return res.status(404).json({ message: 'Certificate not found.' });
        }

        res.status(200).json({ message: 'Certificate updated successfully', certificate: updatedCertificate });
    } catch (error) {
        console.error('Error updating certificate:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        res.status(500).json({ message: 'Failed to update certificate', error: error.message });
    }
});

// --- End MongoDB Connection and Certificate API Routes ---


// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
