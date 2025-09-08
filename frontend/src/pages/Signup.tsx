// src/pages/Signup.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

// Parallax Hook
const useParallax = (speed = 0.2) => {
  const { scrollY } = useScroll();
  return useTransform(scrollY, [0, 1000], [0, scrollY.get() * speed]);
};

// Animated Section
const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const y = useParallax(0.3);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      alert('Account created! Please log in.');
      navigate('/login');
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black z-0" />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i * 2,
              delay: i * 1,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${20 + (i * 20) % 80}%`,
              top: `${20 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 w-full max-w-md px-6 py-10"
        style={{ y }}
      >
        <AnimatedSection delay={0.2}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Join <span className="text-red-500">EDIZO</span> Today
            </h1>
            <p className="text-gray-300">Create your account to get started</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <form onSubmit={handleSignup} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <AnimatedSection delay={0.4}>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 min-h-12 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-md focus:ring-red-500"
                >
                  Create Account
                  <ArrowRight size={20} />
                </button>
              </AnimatedSection>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-red-400 hover:text-red-300 font-medium underline-offset-2 hover:underline">
                  Log In
                </a>
              </p>
            </div>
          </form>
        </AnimatedSection>
      </motion.div>
    </div>
  );
};

export default Signup;