import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Tag, Percent } from 'lucide-react';
import { LazyImage } from './LazyImage';

const PortfolioCard = memo(({
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
  const CardBody = (
    <div className="relative flex flex-col rounded-xl shadow-md border border-gray-200 hover:shadow-lg bg-white transition-shadow duration-200 h-full min-h-[320px] group">
      {/* Image section */}
      <div className="relative h-40 overflow-hidden bg-gray-50 rounded-t-xl">
        <LazyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category pill */}
        {category && (
          <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-bold rounded bg-blue-500 text-white shadow">
            {category}
          </span>
        )}
        {/* Discount Badge */}
        {hasDiscount && maxDiscount && maxDiscount > 0 && (
          <span className="absolute top-4 right-4 px-2 py-1 text-xs rounded bg-green-500 text-white font-bold shadow flex items-center gap-1">
            <Tag size={10} />
            {maxDiscount}% OFF
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
        {shortDescription && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{shortDescription}</p>
        )}
        {isInternship && !shortDescription && (
          <p className="text-gray-500 text-xs mb-2">
            Gain real-world experience on live projects.
          </p>
        )}

        {/* Rating or discount section */}
        {(rating || (hasDiscount && maxDiscount && maxDiscount > 0)) && (
          <div className="flex items-center gap-3 my-2">
            {rating && (
              <span className="flex items-center gap-1 rounded bg-yellow-50 text-yellow-800 text-xs px-2 py-0.5 font-bold">
                <Star className="w-3 h-3" /> {rating}/5
              </span>
            )}
            {hasDiscount && maxDiscount && maxDiscount > 0 && (
              <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                <Percent size={10} /> Up to {maxDiscount}% OFF
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center mt-auto">
          <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-900 font-semibold transition-colors cursor-pointer text-sm">
            <span className="mr-1.5">Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );

  return isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      {CardBody}
    </a>
  ) : (
    <Link to={link} className="block h-full">
      {CardBody}
    </Link>
  );
});

PortfolioCard.displayName = 'PortfolioCard';
export default PortfolioCard;
