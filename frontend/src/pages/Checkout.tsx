// src/pages/Checkout.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

interface SelectedPlan {
  [key: string]: number;
}

interface CheckoutState {
  selectedPlans: SelectedPlan;
  finalPrice: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const { selectedPlans, finalPrice } = location.state as CheckoutState;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    billingAddress: '',
    city: '',
    state: '',
    zip: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-checkout-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selectedPlans,
          finalPrice
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total from selected plans
  const total = Object.values(selectedPlans).reduce((sum, price) => sum + price, 0);
  
  // Calculate discount
  let discountPercentage = 0;
  if (Object.keys(selectedPlans).length >= 3) {
    discountPercentage = 15;
  } else if (Object.keys(selectedPlans).length === 2) {
    discountPercentage = 10;
  }
  const discount = total * (discountPercentage / 100);

  return (
    <>
      <PageHeader
        title="Checkout"
        subtitle="Complete your service selection"
        variant="default"
      />

      <section className="py-12 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Order Summary */}
            <div className="lg:w-2/5">
              <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  {Object.keys(selectedPlans).map((key, index) => {
                    const [serviceIndex, planIndex] = key.split('-').map(Number);
                    const service = ['Web Development', 'App Development', 'UI/UX Design', 'Video Editing', 'Graphic Design', 'API Development'][serviceIndex];
                    const plan = ['Basic', 'Standard', 'Advanced'][planIndex];
                    
                    return (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">{service}</p>
                          <p className="text-sm text-gray-600">{plan}</p>
                        </div>
                        <p className="font-medium">₹{selectedPlans[key].toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({discountPercentage}%)</span>
                    <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg">
                    <span>Total</span>
                    <span>₹{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:w-3/5">
              {isSubmitted ? (
                <AnimatedSection>
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Received!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for your service request. We've received your details and will contact you within 24 hours to discuss project details.
                    </p>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                      <p className="font-medium text-gray-900 mb-2">Order Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">₹{finalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">#{Math.floor(100000 + Math.random() * 900000)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Continue Shopping
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ) : (
                <AnimatedSection>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Project Details</h3>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="billingAddress"
                              value={formData.billingAddress}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                            <input
                              type="text"
                              name="zip"
                              value={formData.zip}
                              onChange={handleChange}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Project Requirements</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Describe your project requirements, timeline, and any special needs..."
                          />
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </form>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;