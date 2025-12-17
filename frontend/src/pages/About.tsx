// src/pages/About.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Heart,
  Lightbulb,
  Eye,
  Rocket,
  Code,
  Palette,
  Smartphone,
  BarChart
} from 'lucide-react';
import { useTeamMembers } from '../components/hooks/useTeamMembers';
import Button from '../components/common/Button';

// Simple animated section with intersection observer
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const About: React.FC = () => {
  const { teamMembers, loading, error } = useTeamMembers();

  const stats = [
    { number: '25+', label: 'Projects Delivered', icon: Award, color: 'from-red-500 to-orange-500' },
    { number: '10+', label: 'Happy Clients', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { number: '5.0', label: 'Client Rating', icon: Star, color: 'from-yellow-500 to-amber-500' },
    { number: '2+', label: 'Years Experience', icon: Calendar, color: 'from-purple-500 to-pink-500' },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We embrace cutting-edge technologies and creative solutions to stay ahead of the curve.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Heart,
      title: 'Client-Centric',
      description: 'Your success is our priority. We build lasting partnerships based on trust and transparency.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Eye,
      title: 'Quality Obsessed',
      description: 'Every pixel, every line of code is crafted with precision and attention to detail.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Rocket,
      title: 'Results Driven',
      description: 'We measure our success by the tangible results and growth we deliver for our clients.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
  ];

  const services = [
    { icon: Globe, title: 'Web Development', description: 'Fast, scalable websites with React & Next.js', color: 'from-blue-600 to-cyan-500' },
    { icon: Palette, title: 'UI/UX Design', description: 'Human-centered design that converts', color: 'from-pink-600 to-rose-500' },
    { icon: Smartphone, title: 'App Development', description: 'Cross-platform mobile solutions', color: 'from-green-600 to-emerald-500' },
    { icon: BarChart, title: 'Digital Marketing', description: 'Data-driven growth strategies', color: 'from-orange-600 to-amber-500' },
    { icon: Code, title: 'API Development', description: 'Robust backend integrations', color: 'from-purple-600 to-violet-500' },
    { icon: TrendingUp, title: 'SEO Optimization', description: 'Dominate search rankings', color: 'from-teal-600 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Premium Glass Design */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-900 to-orange-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEI0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg mb-8">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-white/90">Welcome to EDIZO</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight tracking-tight">
                <span className="text-white">We Craft </span>
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Digital</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Excellence</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-xl md:text-2xl text-center text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                A passionate team of designers, developers, and strategists transforming
                <span className="text-yellow-400 font-semibold"> ideas into impactful digital experiences</span>
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  to="/contact"
                  variant="primary"
                  size="lg"
                  iconRight={<ArrowRight className="w-5 h-5" />}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 border-0 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50"
                >
                  Start a Project
                </Button>
                <Button
                  to="/services"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Explore Services
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>10+ Happy Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>25+ Projects Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>5.0 Client Rating</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats Section - Floating Cards */}
      <section className="py-16 bg-white relative -mt-8 z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Story Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-red-200 to-orange-200 rounded-full blur-3xl opacity-50" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 opacity-20 blur-2xl" />
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800"
                    alt="EDIZO Team at work"
                    className="w-full h-72 object-cover rounded-2xl mb-6 shadow-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <div className="text-3xl font-black text-white">2023</div>
                      <div className="text-sm text-white/70">Founded</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <div className="text-3xl font-black text-white">50+</div>
                      <div className="text-sm text-white/70">Team Members</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-6">
                <Target className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-700">Our Story</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Building the Future of
                <span className="block bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Digital Innovation</span>
              </h2>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Born from a passion for exceptional digital experiences, <strong className="text-gray-900">EDIZO</strong> was founded to bridge the gap between innovative ideas and impactful execution.
              </p>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're not just another agency – we're your partners in digital transformation. Our team combines technical expertise with creative vision to deliver solutions that don't just meet expectations, they exceed them.
              </p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Fast Delivery</div>
                    <div className="text-sm text-gray-600">Quick turnaround</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">100% Quality</div>
                    <div className="text-sm text-gray-600">Guaranteed satisfaction</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-6">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">What Drives Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Our Core <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Values</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide every decision we make and every project we deliver
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className={`group ${value.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                    <value.icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">What We Do</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Our <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Services</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive digital solutions tailored to your business needs
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Link to="/services" className="group block bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-6">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">Meet the Team</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                The <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Experts</span> Behind EDIZO
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A passionate team of designers, developers, and strategists working together
              </p>
            </AnimatedSection>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-600" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-2xl">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Team</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedSection key={member.id} delay={index * 0.1}>
                  <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    {/* Accent Corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

                    {/* Profile Image */}
                    <div className="relative z-10 mb-4">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = '/assets/team/No-Dp-Pics.jpeg';
                          }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-orange-400 font-medium mb-3">{member.role}</p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Mail className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* View Full Team Link */}
          <AnimatedSection delay={0.5}>
            <div className="text-center mt-12">
              <Button
                to="/team"
                variant="outline"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
              >
                View Full Team
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEI0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-8 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                Ready to Transform Your
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Digital Presence?</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join 10+ clients who trust us with their digital transformation. Let's create something amazing together.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  to="/contact"
                  variant="primary"
                  size="xl"
                  iconRight={<ArrowRight className="w-6 h-6" />}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 border-0 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50"
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
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No Obligation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>100% Satisfaction</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;