import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  // Common fields for both form types
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Form type to distinguish between general and service
  formType: {
    type: String,
    required: [true, 'Form type is required'],
    enum: ['general', 'service'],
    default: 'general'
  },
  
  // General query fields
  subject: {
    type: String,
    required: function() {
      return this.formType === 'general';
    },
    trim: true
  },
  message: {
    type: String,
    required: function() {
      return this.formType === 'general';
    },
    trim: true
  },
  
  // Service requirement fields
  service: {
    type: String,
    required: function() {
      return this.formType === 'service';
    },
    trim: true
  },
  projectDetails: {
    type: String,
    required: function() {
      return this.formType === 'service';
    },
    trim: true
  },
  timeline: {
    type: String,
    required: function() {
      return this.formType === 'service';
    },
    trim: true
  },
  budget: {
    type: String,
    required: function() {
      return this.formType === 'service';
    },
    trim: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;