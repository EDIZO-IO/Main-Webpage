// frontend/src/pages/home/PortfolioCard.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Tag, Percent } from 'lucide-react';
import { LazyImage } from './LazyImage';
import { AnimatedSection } from './AnimatedSection';
import { getHighestDiscount, hasDiscount } from '../../utils/internship.utils';

interface PortfolioCardProps {
  img: string;
  title: string;
  category?: string;
  link: string;
  shortDescription?: string;
  isExternal?: boolean;
  isInternship?: boolean;
  maxDiscount?: number;
  hasDiscount?: boolean;
  rating?: number;
}

const PortfolioCard = memo<PortfolioCardProps>(({ 
  img, 
  title, 
  category, 
  link, 
  shortDescription, 
  isExternal = false, 
  isInternship = false,
  maxDiscount,
  hasDiscount,
  rating
}) => {
  const CardContent = (
    <>
      {/* Description Section */}
      <div className="p-6 flex-grow">
        {category && (
          <div className="mb-3">
            <span className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
              {category}
            </span>
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
          {title}
        </h3>
        {shortDescription && (
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {shortDescription}
          </p>
        )}
        {isInternship && !shortDescription && (
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Gain real-world experience on live projects.
          </p>
        )}

        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-gray-800 ml-1">{rating}</span>
            </div>
            {hasDiscount && maxDiscount && maxDiscount > 0 && (
              <div className="flex items-center text-green-600 text-xs font-bold">
                <Percent size={12} className="mr-0.5" />
                Up to {maxDiscount}% OFF
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Section - Full Width */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <LazyImage 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {hasDiscount && maxDiscount && maxDiscount > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
            <Tag size={12} />
            {maxDiscount}% OFF
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Action Section */}
      <div className="p-6">
        <div className="mt-4 inline-flex items-center text-red-600 font-semibold text-sm">
          <span className="mr-2">Explore</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>
    </>
  );

  const cardClasses = "group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full";

  if (isExternal) {
    return (
      <AnimatedSection>
        <motion.div 
          className={cardClasses} 
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full flex flex-col">
            {CardContent}
          </a>
        </motion.div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <motion.div 
        className={cardClasses} 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={link} className="block h-full flex flex-col">
          {CardContent}
        </Link>
      </motion.div>
    </AnimatedSection>
  );
});

PortfolioCard.displayName = 'PortfolioCard';
export default PortfolioCard;