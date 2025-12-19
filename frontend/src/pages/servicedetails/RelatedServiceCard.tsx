import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, IndianRupee } from 'lucide-react';

// Adjust type import if needed
import type { Service } from '../Services';
import { LazyImage } from '../home/LazyImage'; // Update path if needed

interface RelatedServiceCardProps {
  service: Service;
  index: number;
}

const RelatedServiceCard = memo<RelatedServiceCardProps>(({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <Link to={`/services/${service.id}`} className="block h-full group">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg hover:border-blue-400 transition-all duration-300 h-full">
        <div className="relative h-40 overflow-hidden">
          <LazyImage
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Icon badge, if desired */}
          {service.icon && (
            <div className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-200 rounded-md shadow group-hover:bg-blue-50 transition-colors z-10">
              {service.icon}
            </div>
          )}
          {/* Flat title overlay */}
          <div className="absolute bottom-3 left-0 right-0 py-2 px-5 bg-gradient-to-t from-white/95 to-white/70 border-t border-gray-100 flex flex-col">
            <span className="text-base font-bold text-gray-900">{service.title}</span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{service.description}</p>

          {/* Starting Price Badge */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-md">
              <span className="text-xs text-gray-600 font-medium">From</span>
              <div className="flex items-center text-green-700 font-bold text-sm">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{service.startingPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-auto text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
));
RelatedServiceCard.displayName = 'RelatedServiceCard';

export default RelatedServiceCard;

