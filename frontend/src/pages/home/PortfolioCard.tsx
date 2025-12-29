import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Tag, Percent } from 'lucide-react';
import { LazyImage } from './LazyImage';
import { AnimatedSection } from './AnimatedSection';

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
  // Common look for both anchor and Link
  const CardBody = (
    <div className="
      relative flex flex-col rounded-xl shadow-md border border-gray-200 hover:shadow-lg
      bg-white transition-all duration-300 h-full min-h-[340px]
    ">
      {/* Image section */}
      <div className="relative h-44 overflow-hidden bg-gray-50">
        <LazyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category pill */}
        {category && (
          <span className="absolute top-5 left-5 px-3 py-1.5 text-xs font-bold rounded bg-blue-500 text-white shadow">
            {category}
          </span>
        )}
        {/* Discount Badge */}
        {hasDiscount && maxDiscount && maxDiscount > 0 && (
          <span className="absolute top-5 right-5 px-2.5 py-1 text-xs rounded bg-green-500 text-white font-bold shadow flex items-center gap-1">
            <Tag size={12} />
            {maxDiscount}% OFF
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        {shortDescription && (
          <p className="text-gray-700 text-sm mb-2">{shortDescription}</p>
        )}
        {isInternship && !shortDescription && (
          <p className="text-gray-500 text-xs mb-2">
            Gain real-world experience on live projects.
          </p>
        )}

        {/* Rating or discount section */}
        {(rating || (hasDiscount && maxDiscount && maxDiscount > 0)) && (
          <div className="flex items-center gap-4 my-2">
            {rating && (
              <span className="flex items-center gap-1 rounded bg-yellow-50 text-yellow-800 text-xs px-2 py-0.5 font-bold">
                <Star className="w-4 h-4" /> {rating}/5
              </span>
            )}
            {hasDiscount && maxDiscount && maxDiscount > 0 && (
              <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                <Percent size={12} /> Up to {maxDiscount}% OFF
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center mt-auto">
          <span className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-900 font-bold transition-all cursor-pointer shadow-sm text-sm">
            <span className="mr-2">Explore</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-2" />
          </span>
        </div>
      </div>
    </div>
  );

  // Use AnimateSection and framer-motion
  return (
    <AnimatedSection>
      <motion.div whileHover={{ y: -4, scale: 1.025 }} transition={{ duration: 0.16 }}>
        {isExternal ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
            {CardBody}
          </a>
        ) : (
          <Link to={link} className="block h-full">
            {CardBody}
          </Link>
        )}
      </motion.div>
    </AnimatedSection>
  );
});

PortfolioCard.displayName = 'PortfolioCard';
export default PortfolioCard;
