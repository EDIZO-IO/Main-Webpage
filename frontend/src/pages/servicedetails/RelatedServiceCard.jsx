import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Adjust type import if needed

import { LazyImage } from '../home/LazyImage'; // Update path if needed

const RelatedServiceCard = memo(({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{
      duration: 0.4,
      delay: index * 0.12,
      type: "spring",
      stiffness: 100
    }}
  >
    <Link to={`/services/${service.id}`} className="block h-full group">
      <motion.div
        className="backdrop-blur-sm bg-white/90 border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:border-red-300 transition-all duration-300 h-full"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative h-40 overflow-hidden">
          <LazyImage
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon badge with hover animation */}
          {service.icon && (
            <motion.div
              className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 backdrop-blur-sm bg-white/90 border border-gray-200 rounded-lg shadow group-hover:bg-red-50 group-hover:border-red-200 transition-all z-10"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {service.icon}
            </motion.div>
          )}

          {/* Flat title overlay */}
          <div className="absolute bottom-0 left-0 right-0 py-3 px-5 bg-gradient-to-t from-white/95 to-white/80 border-t border-gray-100 flex flex-col">
            <span className="text-base font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-500 transition-all duration-300">{service.title}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">{service.description}</p>

          <div className="flex items-center mt-auto text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 font-semibold text-sm group-hover:gap-2 transition-all">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-2 transition-transform ml-1" />
          </div>
        </div>
      </motion.div>
    </Link>
  </motion.div>
));
RelatedServiceCard.displayName = 'RelatedServiceCard';

export default RelatedServiceCard;
