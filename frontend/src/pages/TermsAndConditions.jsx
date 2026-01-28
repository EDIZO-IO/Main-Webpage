// src/pages/TermsAndConditions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Shield, Clock, Users, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsAndConditions = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Legal terms governing your use of our services and website
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

            {/* Important Notice */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">Important Notice</h3>
                  <p className="text-yellow-700 text-sm">
                    Please read these terms carefully. By using our services, you agree to be bound by these terms and conditions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Introduction */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-600" />
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to EDIZO. These Terms and Conditions ("Terms") govern your use of our website, services, and products. By accessing or using our services, you agree to be bound by these Terms and all applicable laws and regulations.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree with these Terms, you are prohibited from using or accessing this site and our services.
              </p>
            </motion.div>

            {/* Services Description */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-red-600" />
                Services Provided
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                EDIZO provides a range of digital services including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Web development and design services</li>
                <li>Mobile application development</li>
                <li>UI/UX design and consultation</li>
                <li>Digital marketing and SEO services</li>
                <li>Software development and API integration</li>
                <li>Consultation and strategic planning</li>
                <li>Project management and support services</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                All services are provided "as is" and we make no warranties regarding the availability, reliability, or fitness of our services for a particular purpose.
              </p>
            </motion.div>

            {/* User Responsibilities */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-red-600" />
                User Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When using our services, you agree to:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Provide Accurate Information</h3>
                    <p className="text-gray-700 text-sm">
                      Provide accurate, current, and complete information when requested and maintain the accuracy of such information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Use Services Legally</h3>
                    <p className="text-gray-700 text-sm">
                      Use our services only for legal purposes and in compliance with applicable laws and regulations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Respect Intellectual Property</h3>
                    <p className="text-gray-700 text-sm">
                      Respect the intellectual property rights of others and do not use our services to infringe upon such rights.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Maintain Security</h3>
                    <p className="text-gray-700 text-sm">
                      Maintain the security of your account credentials and notify us immediately of Object unauthorized access.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content, features, and functionality on our website and in our services are the exclusive property of EDIZO and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit Object of our intellectual property except as expressly permitted by these Terms or as authorized in writing by EDIZO.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The EDIZO name, logo, and all related names, logos, product and service names are trademarks of EDIZO or its affiliates. You must not use such marks without our prior written permission.
              </p>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In no event shall EDIZO, its directors, employees, partners, agents, suppliers, or affiliates be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Any damages resulting from loss of profits, revenue, data, or business opportunities</li>
                <li>Any damages resulting from your use of or inability to use our services</li>
                <li>Any damages resulting from unauthorized access to or use of our servers</li>
                <li>Any damages resulting from Object third-party content or services</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you in connection with these Terms shall not exceed the amount you paid to EDIZO for the services that gave rise to the claim.
              </p>
            </motion.div>

            {/* Data and Privacy */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Data and Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your use of our services is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </motion.div>

            {/* Termination */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-red-600" />
                Termination
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for Object reason including but not limited to a breach of these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use our services will cease immediately. If you wish to terminate your account, you may simply discontinue using our services.
              </p>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-600" />
                Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at Object time. Changes will be effective immediately upon posting the revised Terms on our website. Your continued use of our services after the posting of Object changes constitutes acceptance of those changes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We will notify you of Object material changes to these Terms through our website or other communication methods. It is your responsibility to review these Terms periodically for changes.
              </p>
            </motion.div>

            {/* Governing Law */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in India.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If Object provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-blue-50 p-6 rounded-xl border border-blue-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Questions About These Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have Object questions about these Terms and Conditions, please contact us:
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;