import { memo } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const ServiceCard = memo(({ service, onApply }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      {/* Color-coded header instead of image */}
      <div className={`h-3 bg-gradient-to-r ${
        service.category === 'Development' ? 'from-blue-500 to-blue-600' :
        service.category === 'Design' ? 'from-purple-500 to-purple-600' :
        service.category === 'Marketing' ? 'from-orange-500 to-orange-600' :
        service.category === 'SEO' ? 'from-green-500 to-green-600' :
        'from-gray-500 to-gray-600'
      }`}></div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            service.category === 'Development' ? 'bg-blue-100 text-blue-700' :
            service.category === 'Design' ? 'bg-purple-100 text-purple-700' :
            service.category === 'Marketing' ? 'bg-orange-100 text-orange-700' :
            service.category === 'SEO' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {service.category}
          </span>
          {service.is_featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Featured
            </span>
          )}
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {service.title}
        </h3>
        {service.subtitle && (
          <p className="text-sm text-orange-600 font-medium mb-3">
            {service.subtitle}
          </p>
        )}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {service.short_description}
        </p>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {service.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
            {service.features.length > 3 && (
              <li className="text-sm text-gray-500 pl-6">
                +{service.features.length - 3} more features
              </li>
            )}
          </ul>
        )}

        {/* Technologies */}
        {service.tags && service.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {service.tags.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded border border-blue-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={() => onApply(service)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
        >
          {service.cta_text || 'Learn More'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;
