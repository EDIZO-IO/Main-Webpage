import { memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter, Users, Calendar, Award, Code, Palette, Smartphone, Globe, Heart, Lightbulb, Trophy, GraduationCap, MessageSquare } from 'lucide-react';
import { useTeamMembers } from '../components/hooks/useTeamMembers';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';

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

const TeamMemberCard = memo(({ member, index }) => (
  <AnimatedSection delay={index * 0.1}>
    <GlassCard className="group text-center h-full flex flex-col">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.currentTarget.src = '/assets/team/No-Dp-Pics.jpeg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <div className="flex gap-3">
            {member.email && (
              <a 
                href={`mailto:${member.email}`} 
                className="p-3 bg-white rounded-full text-gray-900 hover:bg-orange-500 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
            <a 
              href="#" 
              className="p-3 bg-white rounded-full text-gray-900 hover:bg-blue-600 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
              aria-label={`LinkedIn profile of ${member.name}`}
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="p-3 bg-white rounded-full text-gray-900 hover:bg-blue-400 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
              aria-label={`Twitter profile of ${member.name}`}
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
        <p className="text-orange-600 text-base font-medium mb-3">{member.role}</p>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>India</span>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {member.skills?.split(',').slice(0, 3).map((skill, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  </AnimatedSection>
));
TeamMemberCard.displayName = 'TeamMemberCard';

const Team = () => {
  const { teamMembers, loading, error } = useTeamMembers();

  const leadershipTeam = teamMembers.filter(member => 
    member.role.toLowerCase().includes('ceo') || 
    member.role.toLowerCase().includes('founder') || 
    member.role.toLowerCase().includes('director')
  );

  const technicalTeam = teamMembers.filter(member => 
    !member.role.toLowerCase().includes('ceo') && 
    !member.role.toLowerCase().includes('founder') && 
    !member.role.toLowerCase().includes('director') &&
    (member.role.toLowerCase().includes('developer') || 
     member.role.toLowerCase().includes('engineer') || 
     member.role.toLowerCase().includes('tech'))
  );

  const designTeam = teamMembers.filter(member => 
    member.role.toLowerCase().includes('Designer') || 
    member.role.toLowerCase().includes('UI') || 
    member.role.toLowerCase().includes('UX')
  );

  const marketingTeam = teamMembers.filter(member => 
    !member.role.toLowerCase().includes('Designer') && 
    !member.role.toLowerCase().includes('UI') && 
    !member.role.toLowerCase().includes('UX') &&
    (member.role.toLowerCase().includes('Marketing') || 
     member.role.toLowerCase().includes('SEO') || 
     member.role.toLowerCase().includes('Growth'))
  );

  const otherTeam = teamMembers.filter(member => 
    !leadershipTeam.includes(member) && 
    !technicalTeam.includes(member) && 
    !designTeam.includes(member) && 
    !marketingTeam.includes(member)
  );

  const teamSections = [
    { title: "Leadership", members: leadershipTeam, icon: Award, gradient: "from-purple-500 to-indigo-500" },
    { title: "Technical Team", members: technicalTeam, icon: Code, gradient: "from-blue-500 to-cyan-500" },
    { title: "Design Team", members: designTeam, icon: Palette, gradient: "from-pink-500 to-rose-500" },
    { title: "Marketing Team", members: marketingTeam, icon: Globe, gradient: "from-green-500 to-emerald-500" },
    { title: "Operations", members: otherTeam, icon: Smartphone, gradient: "from-orange-500 to-red-500" },
  ].filter(section => section.members.length > 0);

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
          title="Meet Our Team"
          subtitle="The talented individuals behind EDIZO's success stories"
          badge="Our People"
        />

        {/* Team Stats */}
        <section className="py-16 relative -mt-16 z-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnimatedSection delay={0.1}>
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{teamMembers.length}</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </GlassCard>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2}>
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Projects Delivered</div>
                </GlassCard>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3}>
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </GlassCard>
              </AnimatedSection>
              
              <AnimatedSection delay={0.4}>
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">3+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </GlassCard>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Team Sections */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-red-50 rounded-2xl text-red-600">{error}</div>
            ) : (
              teamSections.map((section, sectionIndex) => (
                <div key={section.title} className="mb-20">
                  <div className="flex items-center gap-4 mb-12">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center`}>
                      <section.icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  
                  {section.members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {section.members.map((member, index) => (
                        <TeamMemberCard key={member.id} member={member} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No team members found in this category
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Our Culture</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-6">What Makes Us Tick</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                The values that unite our diverse team and drive our collective success.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Innovation First', 
                  description: 'We embrace cutting-edge technology to solve complex challenges and create unique solutions.',
                  icon: Lightbulb,
                  gradient: 'from-amber-400 to-orange-500'
                },
                { 
                  title: 'Client-Centric', 
                  description: 'Your success is our heartbeat. We treat your goals as ours and celebrate your wins.',
                  icon: Heart,
                  gradient: 'from-rose-400 to-red-500'
                },
                { 
                  title: 'Quality Excellence', 
                  description: 'We obsess over every detail to deliver products that exceed expectations.',
                  icon: Trophy,
                  gradient: 'from-blue-400 to-cyan-500'
                },
                { 
                  title: 'Continuous Learning', 
                  description: 'We stay ahead of industry trends and constantly upgrade our skills.',
                  icon: GraduationCap,
                  gradient: 'from-green-400 to-emerald-500'
                },
                { 
                  title: 'Collaborative Spirit', 
                  description: 'We believe great things happen when talented minds work together.',
                  icon: Users,
                  gradient: 'from-purple-400 to-pink-500'
                },
                { 
                  title: 'Transparent Communication', 
                  description: 'We maintain open, honest communication with our clients and team members.',
                  icon: MessageSquare,
                  gradient: 'from-indigo-400 to-blue-500'
                }
              ].map((value, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <GlassCard className="p-8 h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 z-0"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay z-0"></div>

          <div className="max-w-5xl mx-auto px-4 relative z-10 text-center text-white">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Want to join our <br /> amazing team?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                We're always looking for passionate individuals to grow our team. Check out our careers page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  to="/careers"
                  size="xl"
                  className="bg-white text-orange-600 hover:bg-gray-100 border-none shadow-2xl"
                >
                  View Career Opportunities
                </Button>
                <Button
                  to="/contact"
                  size="xl"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Team;