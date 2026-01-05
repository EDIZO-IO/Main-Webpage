// src/pages/About.tsx
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

// Glass Card Component
const GlassCard = memo<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}>(({ children, className = "", hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -8, scale: 1.02 } : {}}
    className={`relative rounded-3xl overflow-hidden ${className}`}
    style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 15px 50px -12px rgba(0, 0, 0, 0.1)',
    }}
  >
    {children}
  </motion.div>
));
GlassCard.displayName = 'GlassCard';

// Animated Section
const AnimatedSection = memo<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}>(({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
));
AnimatedSection.displayName = 'AnimatedSection';

const About: React.FC = () => {
  const { teamMembers, loading, error } = useTeamMembers();
  const { stats: statsData } = useStats();

  const statsConfig = [
    { key: 'projects_delivered', icon: Award, gradient: 'from-orange-400 to-red-500' },
    { key: 'happy_clients', icon: Users, gradient: 'from-blue-400 to-cyan-500' },
    { key: 'client_rating', icon: Star, gradient: 'from-yellow-400 to-amber-500' },
    { key: 'years_experience', icon: Calendar, gradient: 'from-purple-400 to-pink-500' },
  ];

  const values = [
    { icon: Lightbulb, title: 'Innovation First', description: 'We embrace cutting-edge technologies and creative solutions.', gradient: 'from-yellow-400 to-amber-500' },
    { icon: Heart, title: 'Client-Centric', description: 'Your success is our priority. We build lasting partnerships.', gradient: 'from-red-400 to-rose-500' },
    { icon: Eye, title: 'Quality Obsessed', description: 'Every pixel and line of code is crafted with precision.', gradient: 'from-blue-400 to-cyan-500' },
    { icon: Rocket, title: 'Results Driven', description: 'We measure success by the tangible results we deliver.', gradient: 'from-purple-400 to-violet-500' },
  ];

  const services = [
    { icon: Globe, title: 'Web Development', description: 'Fast, scalable websites with React & Next.js', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Palette, title: 'UI/UX Design', description: 'Human-centered design that converts', gradient: 'from-pink-500 to-rose-500' },
    { icon: Smartphone, title: 'App Development', description: 'Cross-platform mobile solutions', gradient: 'from-green-500 to-emerald-500' },
    { icon: BarChart, title: 'Digital Marketing', description: 'Data-driven growth strategies', gradient: 'from-orange-500 to-amber-500' },
    { icon: Code, title: 'API Development', description: 'Robust backend integrations', gradient: 'from-purple-500 to-violet-500' },
    { icon: TrendingUp, title: 'SEO Optimization', description: 'Dominate search rankings', gradient: 'from-teal-500 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-orange-50/30">
      {/* Page Header */}
      <PageHeader
        title="About EDIZO"
        subtitle="A passionate team of designers, developers, and strategists transforming ideas into impactful digital experiences."
        badge="Our Story"
        showStats
        stats={[
          { value: statsData.happy_clients?.value || '10+', label: 'Clients' },
          { value: statsData.projects_delivered?.value || '25+', label: 'Projects' },
          { value: statsData.client_rating?.value || '5.0', label: 'Rating' },
        ]}
      />

      {/* Stats Section */}
      <section className="relative -mt-12 z-20 pb-26">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsConfig.map((stat, i) => {
              const data = statsData[stat.key] || { value: '...', label: 'Loading...' };
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <GlassCard className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-1">
                      {data.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{data.label}</div>
                  </GlassCard>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image Card */}
            <AnimatedSection>
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute -top-8 -left-8 w-48 h-48 bg-gradient-to-br from-orange-300/40 to-red-300/40 rounded-full blur-3xl"
                />
                <GlassCard className="p-8 relative" hover={false}>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800"
                    alt="EDIZO Team"
                    className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                      <div className="text-3xl font-black">2023</div>
                      <div className="text-sm text-white/80">Founded</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      <div className="text-3xl font-black">50+</div>
                      <div className="text-sm text-white/80">Team Members</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </AnimatedSection>

            {/* Right - Content */}
            <AnimatedSection delay={0.2}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <Target className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Our Mission</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Building the Future of
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Digital Innovation
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Born from a passion for exceptional digital experiences, <strong className="text-gray-900">EDIZO</strong> bridges the gap between innovative ideas and impactful execution.
              </p>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're not just another agency – we're your partners in digital transformation. Our team combines technical expertise with creative vision to deliver solutions that exceed expectations.
              </p>

              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Zap, title: 'Fast Delivery', subtitle: 'Quick turnaround', gradient: 'from-orange-400 to-red-500' },
                  { icon: Shield, title: '100% Quality', subtitle: 'Guaranteed satisfaction', gradient: 'from-blue-400 to-cyan-500' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.subtitle}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}
            >
              <Heart className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-600">What Drives Us</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every decision we make
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <GlassCard className="p-8 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-lg mb-6`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-600">What We Do</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive digital solutions tailored to your needs
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Link to="/services">
                  <GlassCard className="p-8 h-full group cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition-opacity rounded-bl-full"
                      style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="text-blue-500 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </div>
                  </GlassCard>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
              }}
            >
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-600">Meet the Team</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Experts</span> Behind EDIZO
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A passionate team working together to create amazing experiences
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
            </div>
          ) : error ? (
            <GlassCard className="text-center py-12 max-w-lg mx-auto">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Team</h3>
              <p className="text-gray-600">{error}</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                      boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500"
                      style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

                    <div className="p-6 text-center relative z-10">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = '/assets/team/No-Dp-Pics.jpeg';
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-orange-400 font-medium mb-4">{member.role}</p>
                      {member.email && (
                        <motion.a
                          href={`mailto:${member.email}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex w-10 h-10 rounded-xl bg-white/10 hover:bg-orange-500 items-center justify-center transition-colors"
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.5} className="text-center mt-12">
            <Button
              to="/team"
              variant="outline"
              size="lg"
              iconRight={<ArrowRight className="w-5 h-5" />}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              View Full Team
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-red-500/30 to-transparent rounded-full blur-3xl"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.95) 0%, rgba(239, 68, 68, 0.95) 100%)',
              }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Ready to Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                Digital Presence?
              </span>
            </h2>

            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Join {statsData.happy_clients?.value || '10+'} clients who trust us with their digital transformation. Let's create something amazing together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                to="/contact"
                variant="primary"
                size="xl"
                iconRight={<ArrowRight className="w-6 h-6" />}
                className="shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.95) 0%, rgba(239, 68, 68, 0.95) 100%)',
                }}
              >
                Get Started Free
              </Button>
              <Button
                to="/services"
                variant="outline"
                size="xl"
                className="border-white/30 text-white hover:bg-white/10"
              >
                View Our Work
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
              {['Free Consultation', 'No Obligation', '100% Satisfaction'].map((text, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default About;