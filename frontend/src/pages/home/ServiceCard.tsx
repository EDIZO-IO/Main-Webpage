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
        whileHover={{ y: -7, scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="group relative bg-white border border-gray-200 shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-all h-full"
        style={{
          borderRadius: "1.125rem", // uniform rounded
        }}
      >
        {/* Flat, geometric image header section */}
        <div className="relative h-44 overflow-hidden bg-gray-50">
          <LazyImage
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Optional decorative shadow or chip */}
          <div className="absolute top-5 left-5 flex items-center justify-center w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg shadow group-hover:bg-blue-50 transition-colors z-10">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          {/* Service Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 py-2 px-5 bg-gradient-to-t from-white/95 to-white/60 border-t border-gray-100 flex flex-col">
            <span className="text-lg font-bold text-gray-900">{title}</span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <p className="text-gray-700 mb-4 leading-relaxed text-sm">{desc}</p>
          {/* Feature list, pill style */}
          <div className="mb-4 flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded font-medium border border-blue-100">
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded font-bold border border-gray-300">
                +{features.length - 3} more
              </span>
            )}
          </div>
          <Button
            to={link}
            variant="primary"
            size="sm"
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-auto rounded-lg border-none font-bold shadow-none"
            enableFestivalAnimation={false}
            showFestivalEmoji={false}
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
