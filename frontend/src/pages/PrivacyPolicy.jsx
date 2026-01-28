// src/pages/PrivacyPolicy.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Calendar, FileText, User, Mail, Lock, Clock, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity, y }}
            animate={{ opacity, y }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              How we collect, use, and protect your personal information
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2 text-gray-600 mb-8"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Last updated: November 11, 2025</span>
            </motion.div>

            {/* Introduction */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At EDIZO, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </motion.div>

            {/* Information We Collect */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-red-600" />
                Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect information about you in various ways when you use our services:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Name and contact information</li>
                    <li>Email address and phone number</li>
                    <li>Company information</li>
                    <li>Payment information</li>
                    <li>Professional background</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>IP address and browser type</li>
                    <li>Operating system and device information</li>
                    <li>Pages visited and time spent on site</li>
                    <li>Referring website</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* How We Use Your Information */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-red-600" />
                How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect for various purposes:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Service Provision</h3>
                  <p className="text-gray-700 text-sm">
                    To provide and maintain our services, including project management, communication, and support.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                  <p className="text-gray-700 text-sm">
                    To send you updates, newsletters, marketing communications, and other information.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Improvement</h3>
                  <p className="text-gray-700 text-sm">
                    To improve our website, services, and user experience through analytics and feedback.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Compliance</h3>
                  <p className="text-gray-700 text-sm">
                    To comply with legal obligations and protect our rights and interests.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Data Protection */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-red-600" />
                Data Protection and Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security Measures</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Secure server infrastructure with regular security updates</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Retention</h3>
                  <p className="text-gray-700">
                    We retain your personal information only as long as necessary for the purposes outlined in this policy, unless a longer retention period is required by law.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-red-600" />
                Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Access Rights</h3>
                  <p className="text-gray-700 text-sm">
                    You can request access to the personal information we hold about you.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Correction Rights</h3>
                  <p className="text-gray-700 text-sm">
                    You can request correction of inaccurate personal information.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Deletion Rights</h3>
                  <p className="text-gray-700 text-sm">
                    You can request deletion of your personal information under certain circumstances.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Opt-out Rights</h3>
                  <p className="text-gray-700 text-sm">
                    You can opt out of marketing communications at Object time.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-red-600" />
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or concerns about our data practices, please contact us:
              </p>
              
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> edizoofficial@gmail.com
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> edizoteam@gmail.com
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span> +91 70924 35729
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span> Virtual Office, India
                </p>
              </div>
            </motion.div>

            {/* Changes to Policy */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-blue-50 p-6 rounded-xl border border-blue-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of Object changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for Object changes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;