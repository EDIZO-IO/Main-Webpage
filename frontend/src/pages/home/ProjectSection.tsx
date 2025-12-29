// frontend/src/pages/home/ProjectsSection.tsx
import { memo, useMemo } from 'react';
import { ArrowRight, Code, Layers, Shield, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';
import PortfolioCard from './PortfolioCard';

// Import Assets
import faceguard from '../../assets/project/face-Guard.png';
import ransomware from '../../assets/project/Ransomware.png';
import Epicnexus from '../../assets/project/Epic-nexus.png';

// Project-themed static icons
const decorIcons = [
  { Icon: Code, color: '#22c55e' },
  { Icon: Layers, color: '#8b5cf6' },
  { Icon: Shield, color: '#f43f5e' },
  { Icon: Cpu, color: '#06b6d4' },
];

const ProjectsSection = memo(() => {
  const featuredProjects = useMemo(() => [
    {
      id: 'cybersecurity',
      img: ransomware,
      title: 'AI-Based Ransomware Detection System',
      category: 'Cybersecurity',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'An AI system for detecting and preventing ransomware attacks in real-time'
    },
    {
      id: 'ai-computer-vision',
      img: faceguard,
      title: 'FaceGuard-GAN Deepfake Detection',
      category: 'Computer Vision & AI',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'GAN-powered solution for detecting manipulated facial images and videos'
    },
    {
      id: 'web-development',
      img: Epicnexus,
      title: 'Epic Nexus Gaming Community Platform',
      category: 'Web Development',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'Comprehensive gaming community platform with social features and reviews'
    }
  ], []);

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background gradients - static */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-red-100/30 to-orange-100/30 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-tr from-gray-100/40 to-slate-100/40 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-50/20 to-cyan-50/20 rounded-full blur-3xl" />
      </div>

      {/* Static project theme icons */}
      <div className="absolute inset-0 pointer-events-none">
        {decorIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.04]"
            style={{
              top: `${15 + i * 22}%`,
              left: i % 2 === 0 ? '4%' : 'auto',
              right: i % 2 === 1 ? '4%' : 'auto',
              color: item.color,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.04, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          >
            <item.Icon size={55} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/70 border border-gray-200 rounded-full mb-6 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Portfolio</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Work</span>
            </h2>
            <p className="text-xl text-gray-600">
              Award-worthy digital solutions. Explore our complete portfolio on our dedicated platform.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
            >
              <PortfolioCard {...project} isExternal />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button
            href="https://bytecode.edizo.in"
            variant="primary"
            size="lg"
            iconRight={<ArrowRight className="w-5 h-5" />}
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              boxShadow: "0 10px 40px -10px rgba(220,38,38,0.4)"
            }}
          >
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';
export default ProjectsSection;