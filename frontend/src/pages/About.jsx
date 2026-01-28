// src/pages/About.jsx
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Target, Award, Globe, Sparkles, Star, Calendar, TrendingUp, Shield, Zap,
  CheckCircle, ArrowRight, Mail, Heart, Lightbulb, Eye, Rocket, Code, Palette,
  Smartphone, BarChart
} from 'lucide-react';
import { useTeamMembers } from '../components/hooks/useTeamMembers';
import Button from '../components/common/Button';
import PageHeader from '../components/common/PageHeader';
import { useStats } from '../components/hooks/useStats';

// Enhanced Glass Card Component
const GlassCard = memo(({ children, className = "", hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -8, scale: 1.02 } : {}}
    className={`relative backdrop-blur-xl bg-white/40 border border-white/20 shadow-xl rounded-3xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
));
GlassCard.displayName = 'GlassCard';

// Animated Section
const AnimatedSection = memo(({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
));
AnimatedSection.displayName = 'AnimatedSection';

const About = () => {
  const { teamMembers, loading, error } = useTeamMembers();
  const { stats: statsData } = useStats();

  const statsConfig = [
    { key: 'projects_delivered', icon: TrendingUp, gradient: 'from-orange-400 to-red-500' },
    { key: 'happy_clients', icon: Users, gradient: 'from-blue-400 to-cyan-500' },
    { key: 'client_rating', icon: Star, gradient: 'from-yellow-400 to-amber-500' },
    { key: 'years_experience', icon: Calendar, gradient: 'from-purple-400 to-pink-500' },
  ];

  const values = [
    { icon: Lightbulb, title: 'Innovation First', description: 'Embracing cutting-edge tech to solve complex challenges.', gradient: 'from-amber-400 to-orange-500' },
    { icon: Heart, title: 'Client-Centric', description: 'Your success is our heartbeat. We treat your goals as ours.', gradient: 'from-rose-400 to-red-500' },
    { icon: Eye, title: 'Pixel Precision', description: 'Obsessive attention to detail in every design and line of code.', gradient: 'from-cyan-400 to-blue-500' },
    { icon: Rocket, title: 'Impact Driven', description: 'Measuring success by the tangible growth we deliver to you.', gradient: 'from-violet-400 to-purple-500' },
  ];

  const services = [
    { icon: Code, title: 'Web Development', description: 'Blazing fast, SEO-optimized web apps.', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Palette, title: 'UI/UX Design', description: 'Intuitive designs that engage users.', gradient: 'from-pink-500 to-rose-500' },
    { icon: Smartphone, title: 'App Development', description: 'Native-like mobile experiences.', gradient: 'from-green-500 to-emerald-500' },
    { icon: BarChart, title: 'Digital Growth', description: 'Strategies to scale your business.', gradient: 'from-orange-500 to-amber-500' },
    { icon: Target, title: 'SEO Mastery', description: 'Ranking you where it matters.', gradient: 'from-teal-500 to-emerald-500' },
    { icon: Shield, title: 'Cyber Security', description: 'Protecting your digital assets.', gradient: 'from-indigo-500 to-violet-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10">
        {/* Page Header */}
        <PageHeader
          title="We Are EDIZO"
          subtitle="A fusion of creativity and technology, dedicated to transforming your digital vision into reality."
          badge="About Us"
          showStats
          stats={[
            { value: statsData.happy_clients?.value || '10+', label: 'Happy Clients' },
            { value: statsData.projects_delivered?.value || '25+', label: 'Projects Done' },
            { value: statsData.client_rating?.value || '5.0', label: 'Client Rating' },
          ]}
        />

        {/* Floating Stats Board */}
        <section className="relative -mt-16 z-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statsConfig.map((stat, i) => {
                const data = statsData[stat.key] || { value: '...', label: 'Loading...' };
                return (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <GlassCard className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full hover:shadow-2xl transition-all duration-300">
                      <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1 tracking-tight">
                        {data.value}
                      </div>
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{data.label}</div>
                    </GlassCard>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Animation/Image Side */}
              <AnimatedSection>
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-300/30 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl animate-pulse delay-700" />

                  <GlassCard className="p-4" hover={false}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800"
                        alt="EDIZO Team Collaboration"
                        className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-4xl font-bold">2025</p>
                            <p className="text-sm text-gray-300 font-medium tracking-wider">FOUNDED</p>
                          </div>
                          <div className="w-px bg-white/30"></div>
                          <div>
                            <p className="text-4xl font-bold">15+</p>
                            <p className="text-sm text-gray-300 font-medium tracking-wider">EXPERTS</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </AnimatedSection>

              {/* Content Side */}
              <AnimatedSection delay={0.2}>
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100/50 shadow-sm">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-700 tracking-wide">OUR JOURNEY</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1]">
                    Crafting the
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                      Digital Future
                    </span>
                  </h2>

                  <p className="text-xl text-gray-600 leading-relaxed font-light">
                    At <strong className="text-gray-900 font-semibold">EDIZO</strong>, we don't just build software; we engineer experiences. We bridge the chasm between ambitious ideas and flawless execution using the latest in web and mobile technology.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {[
                      { title: "Agile Approach", desc: "Rapid iterations, constant feedback." },
                      { title: "Future Ready", desc: "Scalable tech for long-term growth." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button to="/contact" size="lg" variant="primary" iconRight={<ArrowRight className="w-5 h-5" />}>
                      Start Your Project
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Our DNA</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-6">Values That Drive Us</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                The non-negotiable principles that guide our every pixel and line of code.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <GlassCard className="p-8 h-full hover:bg-white/60 transition-colors duration-300">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-center md:text-left">
              <div>
                <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm">The Squad</span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Meet The Experts</h2>
              </div>
              <Button to="/team" variant="outline" iconRight={<ArrowRight className="w-4 h-4" />}>View All Members</Button>
            </AnimatedSection>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-red-50 rounded-2xl text-red-600">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.slice(0, 4).map((member, i) => (
                  <AnimatedSection key={member.id} delay={i * 0.1}>
                    <GlassCard className="group text-center">
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => { e.currentTarget.src = '/assets/team/No-Dp-Pics.jpeg'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="p-3 bg-white rounded-full text-gray-900 hover:bg-orange-500 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                              <Mail className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        <p className="text-orange-600 text-sm font-medium mt-1">{member.role}</p>
                      </div>
                    </GlassCard>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Big CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 z-0"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay z-0"></div>

          <div className="max-w-5xl mx-auto px-4 relative z-10 text-center text-white">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Ready to build something <br /> extraordinary?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                Join the 15+ experts at EDIZO and lets create digital magic together. Your vision, our code.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  to="/contact"
                  size="xl"
                  className="bg-white text-orange-600 hover:bg-gray-100 border-none shadow-2xl"
                >
                  Let's Talk Business
                </Button>
                <Button
                  to="/services"
                  size="xl"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  Explore Services
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;