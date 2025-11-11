// src/pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Sparkles, 
  Star, 
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useTeamMembers } from '../components/hooks/useTeamMembers';

const About: React.FC = () => {
  const { teamMembers, loading, error } = useTeamMembers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
          
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <motion.div
          className="container mx-auto px-4 lg:px-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-200 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-700">Who We Are</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight"
            >
              <span className="text-gray-900">About </span>
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">EDIZO</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-center text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Empowering brands with creative design, reliable development, and impactful digital solutions
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>10+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>25+ Projects Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>5.0 Client Rating</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-6">
                <Target className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-700">Our Mission</span>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                Empowering Your Digital Journey
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                At EDIZO, we believe in the power of innovation and creativity. Our mission is to transform ideas into digital realities that not only meet but exceed expectations.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We combine cutting-edge technology with strategic thinking to deliver solutions that drive growth, enhance user experiences, and create lasting impact in the digital landscape.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">100% Satisfaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">Results-Driven</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800" 
                  alt="Team collaboration"
                  className="w-full h-80 object-cover rounded-2xl mb-6"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-red-600">5+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-red-600">50+</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '25+', label: 'Projects Delivered', icon: Award },
              { number: '10+', label: 'Happy Clients', icon: Users },
              { number: '5.0', label: 'Client Rating', icon: Star },
              { number: '5+', label: 'Years Experience', icon: Calendar },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">What We Do</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
            >
              Our Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Comprehensive digital solutions tailored to your business needs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Web Development",
                description: "Fast, scalable websites with React & Next.js that deliver exceptional user experiences.",
                icon: "🌐"
              },
              {
                title: "UI/UX Design",
                description: "Human-centered design that creates intuitive and engaging user interfaces.",
                icon: "🎨"
              },
              {
                title: "App Development",
                description: "Cross-platform apps with React Native & Flutter for seamless mobile experiences.",
                icon: "📱"
              },
              {
                title: "SEO Optimization",
                description: "Dominate search engine rankings organically with our proven strategies.",
                icon: "🔍"
              },
              {
                title: "Digital Marketing",
                description: "Reach & engage your audience across multiple channels with data-driven campaigns.",
                icon: "📈"
              },
              {
                title: "API Development",
                description: "Robust, scalable APIs for seamless integration and enhanced functionality.",
                icon: "⚙️"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <button className="text-red-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-6"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Our Team</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
            >
              Meet Our Experts
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              A passionate team of designers, developers, and strategists working together
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Team</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative mb-4">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/team/No-Dp-Pics.jpeg';
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline flex items-center justify-center gap-1">
                        <Mail className="w-4 h-4" /> Email
                      </a>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8 shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold mb-6"
            >
              Ready to Transform Your Business?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Join 10+ clients who trust us with their digital transformation. Let's create something amazing together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all">
                Contact Us
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-2 text-gray-400"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">100% Client Satisfaction Guaranteed</span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;