// InternshipDetails.tsx
import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Wifi, Home, Check, Star, TrendingUp, ArrowLeft, Building2, Calendar,
  Award, Users, Zap, Loader2, AlertCircle, Tag, Percent, Clock, Target,
  CheckCircle, Sparkles, BookOpen, Trophy, Shield, ArrowRight, Tag as TagIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInternship } from '../components/hooks/useInternships';
import { getHighestDiscount, hasDiscount, findValidCoupon, calculatePriceWithCoupon } from '../utils/internship.utils';
import type { AppliedCoupon, InternshipDuration, CouponCode } from '../types/internship.types';

// Fallback image map
const fallbackImages: Record<string, string> = {
  'ui-ux-design': '/assets/images/web-design.png',
  'frontend-development': '/assets/images/responsive-design.png',
  'backend-development': '/assets/images/back-end.png',
  'hr-management': '/assets/images/hr-manager.png',
  'data-analytics': '/assets/images/data-Analystics.png',
  'java-development': '/assets/images/java.png',
  'python-development': '/assets/images/python.png',
  'digital-marketing': '/assets/images/content-strategy.png',
  'ai-ml': '/assets/images/ai-assistant.png',
  'ai-with-chatgpt': '/assets/images/AI with CHATGPT.png',
  'web-development': '/assets/images/web-development.png',
  'csharp': '/assets/images/c-sharp.png',
  default: 'https://via.placeholder.com/800x400?text=Internship+Image',
};

// ✅ Memoized image source function
const getImageSrc = (id: string | undefined, image: string | undefined): string => {
  if (image && (image.startsWith('/') || image.startsWith('http'))) {
    return image;
  }
  if (id && fallbackImages[id]) {
    return fallbackImages[id];
  }
  return fallbackImages.default;
};

// ✅ Memoized Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  variant?: 'primary' | 'outline' | 'default';
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Button = memo<ButtonProps>(({
  children,
  onClick,
  to,
  variant = 'default',
  className = '',
  disabled = false,
  icon
}) => {
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 focus:ring-red-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 shadow-sm',
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses} disabled={disabled}>
      {children}
      {icon}
    </button>
  );
});
Button.displayName = 'Button';

// ✅ Memoized Animated Section
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection = memo<AnimatedSectionProps>(({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
));
AnimatedSection.displayName = 'AnimatedSection';

// ✅ Memoized Info Card with Glass Effect
const InfoCard = memo<{ icon: React.ReactNode; title: string; value: string; color?: string }>(
  ({ icon, title, value, color = 'red' }) => (
    <div className={`flex items-center gap-4 p-4 bg-gradient-to-br from-white to-${color}-50/30 rounded-xl border border-${color}-100/50 hover:border-${color}-200 hover:shadow-lg hover:shadow-${color}-100/30 transition-all duration-300 group backdrop-blur-sm`}>
      <div className={`p-3 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl text-white shadow-lg shadow-${color}-200/50 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
        <p className={`text-${color}-600 font-semibold`}>{value}</p>
      </div>
    </div>
  )
);
InfoCard.displayName = 'InfoCard';

// ✅ Memoized Stat Badge with Glass Effect
const StatBadge = memo<{ icon: React.ReactNode; value: string; label: string; color: string }>(
  ({ icon, value, label, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl hover:shadow-2xl transition-all duration-300 text-center overflow-hidden group`}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50/50 to-${color}-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className={`relative z-10 flex justify-center mb-3`}>
        <div className={`p-3 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl text-white shadow-lg shadow-${color}-200/50 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <div className={`relative z-10 text-2xl font-bold text-gray-900 mb-1`}>{value}</div>
      <div className={`relative z-10 text-sm font-medium text-${color}-600`}>{label}</div>
    </motion.div>
  )
);
StatBadge.displayName = 'StatBadge';

// ✅ Memoized Syllabus Item with Enhanced Design
const SyllabusItem = memo<{ topic: string; index: number }>(({ topic, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.03 }}
    className="flex items-start text-gray-700 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/30 transition-all duration-300 group"
  >
    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 text-sm font-bold shadow-lg shadow-red-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
      {index + 1}
    </div>
    <span className="pt-2 font-medium">{topic}</span>
  </motion.li>
));
SyllabusItem.displayName = 'SyllabusItem';

// ✅ Memoized Period Button
const PeriodButton = memo<{
  period: string;
  isActive: boolean;
  onClick: (period: string) => void;
  hasDiscount: boolean;
  discount: number;
  couponDiscount: number;
}>(({ period, isActive, onClick, hasDiscount, discount, couponDiscount }) => {
  const handleClick = useCallback(() => onClick(period), [period, onClick]);

  const displayPeriod = period
    .replace('-', ' ')
    .replace('days', ' Days')
    .replace('month', ' Month')
    .replace('months', ' Months');

  const totalDiscount = discount + couponDiscount;

  return (
    <motion.button
      onClick={handleClick}
      className={`relative px-6 py-3 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${isActive
        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
        }`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {displayPeriod}
      {totalDiscount > 0 && (
        <span className={`absolute -top-2 -right-2 ${isActive ? 'bg-yellow-400 text-gray-900' : 'bg-green-500 text-white'} text-xs px-2 py-0.5 rounded-full font-bold shadow-md`}>
          -{totalDiscount}%
        </span>
      )}
    </motion.button>
  );
});
PeriodButton.displayName = 'PeriodButton';

// ✅ Memoized Benefit Item with Modern Design
const BenefitItem = memo<{ item: string; index: number; color: string }>(({ item, index, color }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.03 }}
    className={`flex items-start text-gray-700 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-${color}-100/50 hover:border-${color}-200 hover:shadow-lg hover:shadow-${color}-100/30 transition-all duration-300 group`}
  >
    <div className={`bg-gradient-to-br from-${color}-500 to-${color}-600 text-white rounded-xl w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-${color}-200/50`}>
      <Check size={16} strokeWidth={3} />
    </div>
    <span className="pt-1 font-medium">{item}</span>
  </motion.li>
));
BenefitItem.displayName = 'BenefitItem';

// ✅ Memoized Coupon Input
const CouponInput = memo<{
  couponCode: string;
  onApply: () => void;
  onInputChange: (value: string) => void;
  onRemove: () => void;
  isValid: boolean | null;
  errorMessage: string | null;
  appliedCoupon: AppliedCoupon | null;
  disabled: boolean;
}>(({
  couponCode,
  onApply,
  onInputChange,
  onRemove,
  isValid,
  errorMessage,
  appliedCoupon,
  disabled
}) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onInputChange(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            disabled={disabled || appliedCoupon !== null}
            className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 font-medium ${appliedCoupon !== null
              ? 'border-green-300 bg-green-50'
              : isValid === false
                ? 'border-red-300 bg-red-50'
                : isValid === true
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200'
              }`}
          />
          {errorMessage && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <X size={14} />
              {errorMessage}
            </p>
          )}
        </div>
        {appliedCoupon ? (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-3 rounded-xl border border-green-300">
            <TagIcon size={16} />
            <span className="font-medium">{appliedCoupon.code}</span>
            <button
              onClick={onRemove}
              className="ml-2 text-green-600 hover:text-green-800"
              aria-label="Remove coupon"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <Button
            onClick={onApply}
            variant="primary"
            disabled={disabled || !couponCode.trim()}
            className="whitespace-nowrap"
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
});
CouponInput.displayName = 'CouponInput';

// Main Component
const InternshipDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<string>('15-days');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponValidation, setCouponValidation] = useState<{ isValid: boolean | null, message: string | null }>({ isValid: null, message: null });

  const { internship, loading, error } = useInternship(id);

  // ✅ Memoized calculations
  const maxDiscount = useMemo(() =>
    internship ? getHighestDiscount(internship.discount, internship.couponDiscounts) : 0,
    [internship]
  );

  const hasDiscountBadge = useMemo(() =>
    internship ? hasDiscount(internship.discount, internship.couponDiscounts) : false,
    [internship]
  );

  const isTrending = useMemo(() =>
    internship ? internship.rating >= 4.5 : false,
    [internship]
  );

  const syllabusPeriods = useMemo(() =>
    internship ? Object.keys(internship.syllabus).filter(
      period => internship.syllabus[period as keyof typeof internship.syllabus].length > 0
    ) : [],
    [internship]
  );

  const currentSyllabus = useMemo(() =>
    internship?.syllabus[activePeriod as keyof typeof internship.syllabus] || [],
    [internship, activePeriod]
  );

  const currentDiscount = useMemo(() =>
    internship?.discount?.[activePeriod as keyof typeof internship.discount] || 0,
    [internship, activePeriod]
  );

  const currentCouponDiscount = useMemo(() =>
    internship?.couponDiscounts?.[activePeriod as keyof typeof internship.couponDiscounts] || 0,
    [internship, activePeriod]
  );

  // ✅ Apply coupon to application link
  const applicationLink = useMemo(() => {
    let link = `/apply/${id}`;
    if (appliedCoupon && appliedCoupon.isValid) {
      const couponParam = encodeURIComponent(appliedCoupon.code);
      link += `?coupon=${couponParam}`;
    }
    return link;
  }, [id, appliedCoupon]);

  // ✅ Memoized callbacks
  const handlePeriodChange = useCallback((period: string) => {
    setActivePeriod(period);
    // Reset coupon validation when period changes
    if (appliedCoupon) {
      setCouponValidation({ isValid: null, message: null });
      setAppliedCoupon(null);
      setCouponCode('');
    }
  }, [appliedCoupon]);

  const handleGoBack = useCallback(() => {
    navigate('/internships');
  }, [navigate]);

  const handleCouponChange = useCallback((value: string) => {
    setCouponCode(value);
    if (value.trim() === '') {
      setCouponValidation({ isValid: null, message: null });
    }
  }, []);

  const handleApplyCoupon = useCallback(() => {
    if (!internship || !couponCode.trim()) return;

    const validCoupon = findValidCoupon(internship, couponCode.trim(), activePeriod as InternshipDuration);

    if (validCoupon) {
      const couponApplied = calculatePriceWithCoupon(
        internship.pricing?.[activePeriod as keyof typeof internship.pricing] || 0,
        validCoupon
      );

      if (couponApplied.isValid) {
        setAppliedCoupon(couponApplied);
        setCouponValidation({ isValid: true, message: 'Coupon applied successfully!' });
      } else {
        setAppliedCoupon(null);
        setCouponValidation({ isValid: false, message: couponApplied.errorMessage || 'Invalid coupon code' });
      }
    } else {
      setAppliedCoupon(null);
      setCouponValidation({ isValid: false, message: 'Invalid or expired coupon code' });
    }
  }, [internship, couponCode, activePeriod]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponValidation({ isValid: null, message: null });
  }, []);

  // Set initial period when data loads
  useEffect(() => {
    if (syllabusPeriods.length > 0 && !syllabusPeriods.includes(activePeriod)) {
      setActivePeriod(syllabusPeriods[0]);
    }
  }, [syllabusPeriods, activePeriod]);

  // JSON-LD for SEO
  useEffect(() => {
    if (internship && id) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: internship.title,
        description: internship.description,
        provider: {
          '@type': 'Organization',
          name: internship.company,
          url: 'https://www.edizo.in',
        },
        category: internship.category,
        image: getImageSrc(id, internship.image),
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'intern',
        },
        timeRequired: activePeriod,
        url: `https://www.edizo.in/internships/${internship.id}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: internship.rating,
          ratingCount: 100,
          bestRating: 5
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'internship-schema';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const existing = document.getElementById('internship-schema');
        if (existing) document.head.removeChild(existing);
      };
    }
  }, [internship, activePeriod, id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center py-20 px-6">
        <div className="text-center">
          <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={56} />
          <p className="text-gray-700 text-xl font-medium">Loading internship details...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !internship) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
        >
          <AlertCircle className="text-red-600 mx-auto mb-6" size={72} />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Internship Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            {error || "The internship you're looking for does not exist or has been removed."}
          </p>
          <Button onClick={handleGoBack} variant="primary" icon={<ArrowLeft size={18} />}>
            Back to Internships
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pt-20 pb-16 px-4 md:px-6 lg:px-8">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden mb-10 shadow-2xl">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src={getImageSrc(id, internship.image)}
          alt={`${internship.title} course banner`}
          className="w-full h-80 md:h-96 object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImages.default;
          }}
        />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                left: `${15 + i * 25}%`,
                top: `${20 + i * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90 text-sm font-semibold">Professional Internship Program</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 drop-shadow-2xl leading-tight">
              {internship.title}
            </h1>

            <div className="flex items-center gap-3 flex-wrap justify-center mb-6">
              <span className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                <Building2 size={18} />
                {internship.company}
              </span>
              <span className="inline-flex items-center gap-2 bg-gray-700/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                {internship.mode === 'Online' ? <Wifi size={18} /> : <Home size={18} />}
                {internship.mode}
              </span>
              {isTrending && (
                <span className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg animate-pulse">
                  <TrendingUp size={18} />
                  Trending
                </span>
              )}
              {hasDiscountBadge && maxDiscount > 0 && (
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  <Tag size={18} />
                  Up to {maxDiscount}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill={i < Math.floor(internship.rating) ? 'currentColor' : 'none'}
                  className="drop-shadow-lg"
                />
              ))}
              <span className="text-white font-bold text-lg ml-2">
                {internship.rating} / 5.0
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <AnimatedSection>
          <Link
            to="/internships"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-8 transition-all duration-200 group bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Internships</span>
          </Link>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatBadge icon={<Clock className="w-6 h-6" />} value="Flexible" label="Duration" color="blue" />
            <StatBadge icon={<Trophy className="w-6 h-6" />} value="Certificate" label="Guaranteed" color="yellow" />
            <StatBadge icon={<Target className="w-6 h-6" />} value="Practical" label="Learning" color="green" />
            <StatBadge icon={<Shield className="w-6 h-6" />} value="100%" label="Satisfaction" color="red" />
          </div>
        </AnimatedSection>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sticky Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white sticky top-24">
                <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                  <div className="relative">
                    <img
                      src={getImageSrc(id, internship.image)}
                      alt={`${internship.title} thumbnail`}
                      className="w-20 h-20 object-cover rounded-xl shadow-lg mr-4"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages.default;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{internship.category}</h3>
                    <p className="text-red-600 font-medium text-sm">Professional Program</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <InfoCard
                    icon={<Building2 size={20} />}
                    title="Company"
                    value={internship.company}
                    color="blue"
                  />
                  <InfoCard
                    icon={internship.mode === 'Online' ? <Wifi size={20} /> : <Home size={20} />}
                    title="Mode"
                    value={internship.mode}
                    color="purple"
                  />
                  <InfoCard
                    icon={<Star size={20} fill="currentColor" />}
                    title="Rating"
                    value={`${internship.rating} / 5.0`}
                    color="yellow"
                  />
                  <InfoCard
                    icon={<Award size={20} />}
                    title="Certification"
                    value="Guaranteed"
                    color="green"
                  />

                  {hasDiscountBadge && maxDiscount > 0 && (
                    <div className="mt-4">
                      <motion.div
                        className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 rounded-xl border border-green-200 shadow-lg shadow-green-100/50 overflow-hidden relative"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-300/30 to-transparent rounded-bl-full" />
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                          <div className="p-2 bg-green-500 rounded-lg text-white shadow-md">
                            <Percent size={18} />
                          </div>
                          <h4 className="font-bold text-green-800">Limited Time Offer</h4>
                        </div>
                        <p className="text-green-700 text-3xl font-bold relative z-10">
                          Up to {maxDiscount}% OFF
                        </p>
                        <p className="text-green-600 text-sm mt-1">Don't miss this opportunity!</p>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Coupon Input Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Apply Coupon</h4>
                  <CouponInput
                    couponCode={couponCode}
                    onInputChange={handleCouponChange}
                    onApply={handleApplyCoupon}
                    onRemove={handleRemoveCoupon}
                    isValid={couponValidation.isValid}
                    errorMessage={couponValidation.message}
                    appliedCoupon={appliedCoupon}
                    disabled={!internship}
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button to={applicationLink} variant="primary" className="w-full text-lg py-4">
                    Apply Now
                    <ArrowRight size={20} />
                  </Button>
                  <p className="text-gray-500 text-xs text-center mt-3">
                    <CheckCircle size={14} className="inline mr-1" />
                    Limited seats available
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            {/* About Section */}
            <AnimatedSection>
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100/50 to-transparent rounded-bl-full" />
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-white shadow-lg shadow-red-200/50">
                    <BookOpen size={24} />
                  </div>
                  About This Program
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed relative z-10">
                  {internship.description}
                </p>
              </div>
            </AnimatedSection>

            {/* Syllabus Section */}
            {syllabusPeriods.length > 0 && (
              <AnimatedSection delay={0.1}>
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100/50 to-transparent rounded-bl-full" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white shadow-lg shadow-orange-200/50">
                      <Calendar size={24} />
                    </div>
                    Program Syllabus
                  </h3>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {syllabusPeriods.map((period) => (
                      <PeriodButton
                        key={period}
                        period={period}
                        isActive={activePeriod === period}
                        onClick={handlePeriodChange}
                        hasDiscount={internship.discount?.[period as keyof typeof internship.discount] > 0}
                        discount={internship.discount?.[period as keyof typeof internship.discount] || 0}
                        couponDiscount={internship.couponDiscounts?.[period as keyof typeof internship.couponDiscounts] || 0}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePeriod}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentSyllabus.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                            <h4 className="text-xl font-bold text-gray-900">
                              {activePeriod.replace('-', ' ').replace('days', ' Days').replace('month', ' Month').replace('months', ' Months')} Curriculum
                            </h4>
                            {currentDiscount > 0 && (
                              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                                <Tag size={16} />
                                {currentDiscount}% OFF
                              </span>
                            )}
                          </div>
                          <ul className="space-y-3">
                            {currentSyllabus.map((topic, index) => (
                              <SyllabusItem key={index} topic={topic} index={index} />
                            ))}
                          </ul>
                        </>
                      ) : (
                        <div className="text-center py-12 bg-yellow-50 rounded-xl border border-yellow-200">
                          <AlertCircle className="text-yellow-600 mx-auto mb-3" size={48} />
                          <p className="text-gray-600">No syllabus available for this duration.</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            )}

            {/* Why Choose Section */}
            {internship.whyChooseEdizo && internship.whyChooseEdizo.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-transparent rounded-bl-full" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-200/50">
                      <Users size={24} />
                    </div>
                    Why Choose {internship.company}?
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {internship.whyChooseEdizo.map((item, index) => (
                      <BenefitItem key={index} item={item} index={index} color="blue" />
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Benefits Section */}
            {internship.benefits && internship.benefits.length > 0 && (
              <AnimatedSection delay={0.3}>
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100/50 to-transparent rounded-bl-full" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-green-200/50">
                      <Zap size={24} />
                    </div>
                    Career Benefits
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {internship.benefits.map((item, index) => (
                      <BenefitItem key={index} item={item} index={index} color="green" />
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Enhanced CTA */}
            <AnimatedSection delay={0.4}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 p-10 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                <div className="relative z-10 text-center text-white">
                  <Trophy className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Career?</h3>
                  <p className="text-xl mb-6 text-white/90 max-w-2xl mx-auto">
                    Join thousands of successful students. Start your journey today!
                  </p>

                  {hasDiscountBadge && maxDiscount > 0 && (
                    <div className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-4 mb-6 inline-block">
                      <p className="text-yellow-300 font-bold text-2xl flex items-center gap-2 justify-center">
                        <Tag size={28} />
                        Limited Time: Up to {maxDiscount}% OFF
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      to={applicationLink}
                      variant="primary"
                      className="bg-white text-red-600 hover:bg-gray-50 text-xl px-10 py-5 shadow-2xl"
                    >
                      Apply Now
                      <ArrowRight size={24} />
                    </Button>
                    <Button
                      to="/contact"
                      variant="outline"
                      className="border-2 border-white/50 text-white hover:bg-white/10 text-xl px-10 py-5"
                    >
                      Contact Us
                    </Button>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle size={18} />
                      Limited Seats
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={18} />
                      100% Certification
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={18} />
                      Expert Mentorship
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;