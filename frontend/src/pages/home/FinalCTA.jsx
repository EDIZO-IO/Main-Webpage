import React, { useState } from 'react';
import { Download, CheckCircle, Star, Users, Award, Briefcase, Zap, Lock } from 'lucide-react';

const LeadMagnetModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !name || !consent) return;
    
    onSubmit({ email, name });
    setEmail('');
    setName('');
    setConsent(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-edizo-red to-orange-500 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Free Digital Strategy Guide</h3>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Zap className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90">Get our exclusive guide to boost your business growth</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-edizo-red focus:border-transparent outline-none transition-all"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-edizo-red focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-edizo-red focus:ring-edizo-red border-gray-300 rounded"
                required
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I agree to receive emails from Edizo and consent to the processing of my personal data.
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-edizo-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
            >
              Get Free Guide Now
            </button>
          </div>
        </form>
        
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <Lock className="w-4 h-4 mr-2 text-green-600" />
            <span>Your information is secure. We never share your data.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinalCTA = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLeadMagnetSubmit = (userData) => {
    console.log('Lead magnet submitted:', userData);
    alert('Thank you! Your free guide is on its way to your email.');
    setIsModalOpen(false);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-edizo-red to-orange-600 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join hundreds of businesses that have accelerated their growth with our digital solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <Award className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
            <p className="text-white/80">Personalized strategies from industry experts</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <Zap className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-lg font-semibold mb-2">Quick Results</h3>
            <p className="text-white/80">See measurable impact within 30 days</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <Briefcase className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-lg font-semibold mb-2">Proven Process</h3>
            <p className="text-white/80">Trusted by 500+ successful businesses</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-edizo-red px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Get Free Strategy Guide
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-edizo-red transition-colors">
            Schedule Consultation
          </button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/80">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </div>

      <LeadMagnetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleLeadMagnetSubmit} 
      />
    </section>
  );
};

export default FinalCTA;