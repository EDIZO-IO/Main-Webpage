// frontend/src/pages/home/ProjectsSection.tsx
import React, { memo, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';
import PortfolioCard from './PortfolioCard';

// Import Assets
import faceguard from '../../assets/project/face-Guard.png';
import ransomware from '../../assets/project/Ransomware.png';
import Epicnexus from '../../assets/project/Epic-nexus.png';

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
    <section className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-700">Portfolio</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Our Work
            </h2>
            <p className="text-xl text-gray-600">
              Award-worthy digital solutions. Explore our complete portfolio on our dedicated platform.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {featuredProjects.map((project) => (
            <PortfolioCard key={project.id} {...project} isExternal />
          ))}
        </div>

        <div className="text-center">
          <Button 
            href="https://bytecode.edizo.in" 
            variant="primary"
            size="lg"
            enableFestivalAnimation={true}
            showFestivalEmoji={true}
            iconRight={<ArrowRight className="w-5 h-5" />}
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';
export default ProjectsSection;