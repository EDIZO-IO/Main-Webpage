// frontend/src/pages/home/ServiceCard.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { LazyImage } from './LazyImage';
import { AnimatedSection } from './AnimatedSection';

interface ServiceCardProps {
  img: string;
  title: string;
  desc: string;
  link: string;
  features: string[];
}

const ServiceCard = memo<ServiceCardProps>(({ img, title, desc, link, features }) => {
  return (
    <AnimatedSection>
      <motion.div
        className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
      >
        {/* Content Section */}
        <div className="p-6 flex-grow">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{desc}</p>
          
          {/* Features List */}
          <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 mb-6">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Section - Full Width */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <LazyImage
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Button Section */}
        <div className="p-6">
          <Button
            to={link}
            variant="primary"
            size="sm"
            enableFestivalAnimation={false}
            showFestivalEmoji={false}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full"
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    </AnimatedSection>
  );
});

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;