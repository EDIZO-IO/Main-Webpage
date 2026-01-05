import { memo } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
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
    <div className="group relative bg-white border border-gray-100 shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 h-full rounded-2xl">
      {/* Image header section */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <LazyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Check badge */}
        <div className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-white/90 border border-gray-200 rounded-lg shadow-sm z-10">
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>

        {/* Service Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 py-2 px-5 bg-gradient-to-t from-white/10 via-white/10 border border-gray-300 flex flex-col">
          <span className="text-lg font-bold text-gray-600 hover:text-white">{title}</span>
        </div>
      </div>


      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">{desc}</p>

        {/* Feature list */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs bg-red-50 text-red-400 px-2 py-1 rounded-md font-medium border border-red-100">
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
              +{features.length - 3} more
            </span>
          )}
        </div>

        <Button
          to={link}
          variant="primary"
          size="sm"
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-auto rounded-2xl border-none font-semibold"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
          }}
        >
          Learn More
        </Button>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;
