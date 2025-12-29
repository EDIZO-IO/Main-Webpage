import { memo } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { LazyImage } from './LazyImage';

interface ServiceCardProps {
  img: string;
  title: string;
  desc: string;
  link: string;
  features: string[];
  startingPrice?: number;
}

const ServiceCard = memo<ServiceCardProps>(({ img, title, desc, link, features }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 h-full rounded-3xl"
    >
      {/* Image header section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <LazyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Check badge with brand colors */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute top-5 left-5 flex items-center justify-center w-12 h-12 backdrop-blur-xl bg-white/80 border border-white/50 rounded-xl shadow-lg group-hover:bg-red-50 transition-colors z-10"
        >
          <CheckCircle className="w-6 h-6 text-green-500" />
        </motion.div>

        {/* Service Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 py-3 px-5 bg-gradient-to-t from-white via-white/95 to-transparent">
          <span className="text-xl font-bold text-gray-900">{title}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">{desc}</p>

        {/* Feature list with brand colors */}
        <div className="mb-6 flex flex-wrap gap-2">
          {features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs bg-gradient-to-r from-red-50 to-orange-50 text-red-700 px-3 py-1.5 rounded-lg font-medium border border-red-100">
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-bold border border-gray-200">
              +{features.length - 3} more
            </span>
          )}
        </div>

        <Button
          to={link}
          variant="primary"
          size="sm"
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-auto rounded-xl border-none font-bold shadow-none"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
          }}
        >
          Learn More
        </Button>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;
