// src/pages/Pricing.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Smartphone,
  Palette,
  Video,
  Server,
  ArrowRight,
  Check,
  X,
  MessageSquare,
  Minus,
  Plus,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

interface Plan {
  name: string;
  price: number;
  features: string[];
  ctaText: string;
}

interface Service {
  title: string;
  icon: React.ReactNode;
  plans: Plan[];
}

const PricingPage: React.FC = () => {
  const servicePricing: Service[] = [
    {
      title: "Web Development",
      icon: <Globe className="text-blue-500" size={24} />,
      plans: [
        {
          name: "Basic",
          price: 15000,
          features: [
            "Up to 5 pages",
            "Responsive design",
            "Basic SEO optimization",
            "Contact form",
            "1 month support"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Standard",
          price: 35000,
          features: [
            "Up to 10 pages",
            "Responsive design",
            "Advanced SEO",
            "Contact forms & CMS",
            "Blog integration",
            "3 months support"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Advanced",
          price: 65000,
          features: [
            "Unlimited pages",
            "Custom functionality",
            "E-commerce integration",
            "Advanced SEO",
            "Blog & CMS",
            "API integration",
            "6 months support"
          ],
          ctaText: "Select Plan"
        }
      ]
    },
    {
      title: "App Development",
      icon: <Smartphone className="text-green-500" size={24} />,
      plans: [
        {
          name: "Basic",
          price: 30000,
          features: [
            "Up to 5 screens",
            "Basic functionality",
            "iOS or Android",
            "Simple UI/UX",
            "Basic testing",
            "1 month support"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Standard",
          price: 65000,
          features: [
            "Up to 15 screens",
            "Core functionality",
            "Cross-platform (iOS & Android)",
            "Custom UI/UX",
            "Push notifications",
            "API integration",
            "3 months support"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Advanced",
          price: 120000,
          features: [
            "Unlimited screens",
            "Full feature set",
            "Cross-platform (iOS & Android)",
            "Advanced UI/UX",
            "Push notifications",
            "Offline functionality",
            "API integration",
            "Analytics",
            "6 months support"
          ],
          ctaText: "Select Plan"
        }
      ]
    },
    {
      title: "UI/UX Design",
      icon: <Palette className="text-purple-500" size={24} />,
      plans: [
        {
          name: "Basic",
          price: 8000,
          features: [
            "Up to 5 screens",
            "Basic wireframes",
            "Style guide",
            "2 revision rounds",
            "Source files"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Standard",
          price: 20000,
          features: [
            "Up to 15 screens",
            "Complete wireframes",
            "Interactive prototype",
            "Style guide",
            "User flow diagrams",
            "3 revision rounds",
            "Source files"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Advanced",
          price: 40000,
          features: [
            "Unlimited screens",
            "Complete wireframes",
            "Interactive prototype",
            "Style guide",
            "User flow diagrams",
            "User research",
            "Usability testing",
            "Design system",
            "5 revision rounds",
            "Source files"
          ],
          ctaText: "Select Plan"
        }
      ]
    },
    {
      title: "Video Editing",
      icon: <Video className="text-red-500" size={24} />,
      plans: [
        {
          name: "Basic",
          price: 5000,
          features: [
            "Up to 2 minutes",
            "Basic color correction",
            "Simple transitions",
            "Background music",
            "1 revision"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Standard",
          price: 12000,
          features: [
            "Up to 5 minutes",
            "Advanced color grading",
            "Motion graphics",
            "Custom sound design",
            "Multiple revisions",
            "Social media formats"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Advanced",
          price: 25000,
          features: [
            "Up to 10 minutes",
            "Professional color grading",
            "Complex VFX",
            "Custom animations",
            "Original music composition",
            "Multiple format delivery",
            "Extended revisions"
          ],
          ctaText: "Select Plan"
        }
      ]
    },
    {
      title: "Graphic Design",
      icon: <Palette className="text-pink-500" size={24} />,
      plans: [
        {
          name: "Basic",
          price: 3000,
          features: [
            "Logo design",
            "Business card",
            "Simple social media graphics",
            "2 design concepts",
            "2 revisions"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Standard",
          price: 8000,
          features: [
            "Logo design + brand guidelines",
            "Business card + letterhead",
            "Social media templates",
            "Brochure design",
            "4 design concepts",
            "3 revisions"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Advanced",
          price: 15000,
          features: [
            "Complete brand identity",
            "Logo + brand guidelines",
            "Marketing collateral",
            "Packaging design",
            "Social media kit",
            "Stationery design",
            "Unlimited revisions",
            "Source files"
          ],
          ctaText: "Select Plan"
        }
      ]
    },
    {
      title: "API Development",
      icon: <Server className="text-gray-600" size={24} />,
      plans: [
        {
          name: "Basic",
          price: 12000,
          features: [
            "Up to 5 endpoints",
            "Basic authentication",
            "JSON response",
            "Documentation",
            "1 month support"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Standard",
          price: 28000,
          features: [
            "Up to 15 endpoints",
            "Advanced authentication",
            "Rate limiting",
            "Comprehensive documentation",
            "Testing & monitoring",
            "3 months support"
          ],
          ctaText: "Select Plan"
        },
        {
          name: "Advanced",
          price: 50000,
          features: [
            "Unlimited endpoints",
            "OAuth integration",
            "Real-time capabilities",
            "GraphQL support",
            "Advanced security",
            "Comprehensive documentation",
            "Testing & monitoring",
            "6 months support"
          ],
          ctaText: "Select Plan"
        }
      ]
    }
  ];

  // State for selected plans
  const [selectedPlans, setSelectedPlans] = useState<{[key: string]: number}>({});
  
  // State for custom pricing requests
  const [customRequests, setCustomRequests] = useState<{[key: string]: { price: number; message: string }}>({});
  const [showCustomForm, setShowCustomForm] = useState<string | null>(null);
  const [budget, setBudget] = useState<number | ''>('');
  const [customMessage, setCustomMessage] = useState('');
  
  const navigate = useNavigate();
  
  // Calculate total price and discount
  const calculateTotal = () => {
    const total = Object.values(selectedPlans).reduce((sum, price) => sum + price, 0);
    
    // Calculate discount based on number of packages selected
    let discountPercentage = 0;
    if (Object.keys(selectedPlans).length >= 3) {
      discountPercentage = 15; // 15% discount for 3+ packages
    } else if (Object.keys(selectedPlans).length === 2) {
      discountPercentage = 10; // 10% discount for 2 packages
    }
    
    const discount = total * (discountPercentage / 100);
    const finalPrice = total - discount;
    
    return {
      total,
      discount,
      discountPercentage,
      finalPrice
    };
  };

  // Toggle plan selection
  const togglePlan = (serviceIndex: number, planIndex: number) => {
    const serviceKey = `${serviceIndex}-${planIndex}`;
    const plan = servicePricing[serviceIndex].plans[planIndex];
    
    if (selectedPlans[serviceKey]) {
      // Remove if already selected
      const newSelected = { ...selectedPlans };
      delete newSelected[serviceKey];
      
      // Also remove custom request if exists
      const newCustomRequests = { ...customRequests };
      delete newCustomRequests[serviceKey];
      setCustomRequests(newCustomRequests);
      
      setSelectedPlans(newSelected);
    } else {
      // Add if not selected
      setSelectedPlans({
        ...selectedPlans,
        [serviceKey]: plan.price
      });
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedPlans({});
    setCustomRequests({});
  };

  // Handle custom price request
  const handleCustomRequest = (serviceIndex: number, planIndex: number) => {
    const serviceKey = `${serviceIndex}-${planIndex}`;
    const plan = servicePricing[serviceIndex].plans[planIndex];
    
    if (customRequests[serviceKey]) {
      // Remove custom request
      const newCustomRequests = { ...customRequests };
      delete newCustomRequests[serviceKey];
      setCustomRequests(newCustomRequests);
      
      // Reset to default price
      setSelectedPlans({
        ...selectedPlans,
        [serviceKey]: plan.price
      });
    } else {
      // Show custom form
      setShowCustomForm(serviceKey);
    }
  };

  // Handle custom form submission
  const handleCustomSubmit = (serviceIndex: number, planIndex: number) => {
    const serviceKey = `${serviceIndex}-${planIndex}`;
    const plan = servicePricing[serviceIndex].plans[planIndex];
    
    if (budget === '') {
      alert('Please enter a budget');
      return;
    }
    
    if (customMessage.trim() === '') {
      alert('Please provide details about your requirements');
      return;
    }
    
    // Add to custom requests
    const newCustomRequests = {
      ...customRequests,
      [serviceKey]: {
        price: Number(budget),
        message: customMessage
      }
    };
    
    setCustomRequests(newCustomRequests);
    
    // Add to selected plans with custom price
    setSelectedPlans({
      ...selectedPlans,
      [serviceKey]: Number(budget)
    });
    
    // Reset form
    setBudget('');
    setCustomMessage('');
    setShowCustomForm(null);
  };

  // Cancel custom form
  const handleCustomCancel = () => {
    setBudget('');
    setCustomMessage('');
    setShowCustomForm(null);
  };

  const { total, discount, discountPercentage, finalPrice } = calculateTotal();

  return (
    <>
      <PageHeader
        title="Service Pricing"
        subtitle="Transparent pricing for all our services"
        variant="default"
      />

      {/* Summary Section */}
      {Object.keys(selectedPlans).length > 0 && (
        <section className="py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your Selected Packages</h3>
                  <p className="text-gray-600">
                    {Object.keys(selectedPlans).length} package{Object.keys(selectedPlans).length > 1 ? 's' : ''} selected
                  </p>
                </div>
                
                <button 
                  onClick={clearAllSelections}
                  className="mt-4 md:mt-0 flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                >
                  <X size={18} />
                  Clear All
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-600">Original Price</p>
                  <p className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-600">Discount ({discountPercentage}%)</p>
                  <p className="text-2xl font-bold text-green-600">-₹{discount.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-xl">
                  <p className="text-white/80">Final Price</p>
                  <p className="text-2xl font-bold text-white">₹{finalPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/checkout', { state: { selectedPlans, finalPrice } })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors w-full md:w-auto justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Cards */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePricing.map((service, serviceIndex) => (
              <AnimatedSection key={serviceIndex} delay={serviceIndex * 0.1}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col h-full"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full mr-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {service.plans.map((plan, planIndex) => {
                      const serviceKey = `${serviceIndex}-${planIndex}`;
                      const isSelected = !!selectedPlans[serviceKey];
                      const isCustom = !!customRequests[serviceKey];
                      
                      return (
                        <div 
                          key={planIndex} 
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            isSelected 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-gray-900">{plan.name}</h4>
                            <div className="text-2xl font-bold text-gray-900">
                              {isCustom ? `₹${customRequests[serviceKey].price.toLocaleString()}` : `₹${plan.price.toLocaleString()}`}
                            </div>
                          </div>
                          
                          <ul className="space-y-2 mb-4">
                            {plan.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {showCustomForm === serviceKey ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Budget (₹)</label>
                                <input
                                  type="number"
                                  value={budget}
                                  onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : '')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                  placeholder="Enter your budget"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                <textarea
                                  value={customMessage}
                                  onChange={(e) => setCustomMessage(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                  placeholder="Describe your specific requirements"
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCustomSubmit(serviceIndex, planIndex)}
                                  className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                  <Check size={18} />
                                  Confirm
                                </button>
                                <button
                                  onClick={handleCustomCancel}
                                  className="flex-1 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                >
                                  <X size={18} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => togglePlan(serviceIndex, planIndex)}
                                className={`py-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <Check size={18} />
                                    Selected
                                  </>
                                ) : (
                                  plan.ctaText
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleCustomRequest(serviceIndex, planIndex)}
                                className={`py-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                  isCustom 
                                    ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <MessageSquare size={18} />
                                {isCustom ? 'Custom Price Applied' : 'Custom Quote'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Select multiple packages to get discount!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2 packages: 10% discount | 3+ packages: 15% discount
            </div>
          </div>
        </div>
      </section>

      {/* Final Price Summary at Bottom */}
      {Object.keys(selectedPlans).length > 0 && (
        <section className="py-12 bg-gradient-to-r from-gray-100 to-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Your Final Price Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-gray-600">Original Price</p>
                  <p className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-gray-600">Discount ({discountPercentage}%)</p>
                  <p className="text-2xl font-bold text-green-600">-₹{discount.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-xl text-center">
                  <p className="text-white/80">Final Price</p>
                  <p className="text-2xl font-bold text-white">₹{finalPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => navigate('/checkout', { state: { selectedPlans, finalPrice } })}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Let's discuss how our services can help you achieve your goals.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 min-h-12"
              >
                Start Your Project Today
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
            <p className="text-gray-500 text-sm mt-4">Free consultation • No obligation • Expert advice</p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default PricingPage;