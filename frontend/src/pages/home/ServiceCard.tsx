import { memo } from 'react';
import { CheckCircle, ArrowRight, IndianRupee } from 'lucide-react';
import Button from '../../components/common/Button';
import { LazyImage } from './LazyImage';
import { AnimatedSection } from './AnimatedSection';

interface ServiceCardProps {
  img: string;
  title: string;
  desc: string;
  link: string;
  features: string[];
  startingPrice: number;
}

const ServiceCard = memo<ServiceCardProps>(({ img, title, desc, link, features, startingPrice }) => {
  return (
    <AnimatedSection>
      <div
        className="group relative bg-white border border-gray-200 shadow-md overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200 h-full"
        style={{
          borderRadius: "1.125rem",
        }}
      >
        {/* Flat, geometric image header section */}
        <div className="relative h-44 overflow-hidden bg-gray-50">
          <LazyImage
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

          {/* Starting Price Badge */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <span className="text-xs text-gray-600 font-medium">Starts from</span>
              <div className="flex items-center text-green-700 font-bold">
                <IndianRupee className="w-4 h-4" />
                <span>{startingPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-xs text-gray-500 ml-1">*</span>
            </div>
          </div>

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
          >
            Learn More
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
});

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;

