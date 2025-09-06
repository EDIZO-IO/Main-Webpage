
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wifi,
  Home,
  Check,
  Star,
  TrendingUp,
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import JSON data
import internshipsData from './internships.json';

// Define the Internship interface
interface Internship {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  company: string;
  image: string;
  rating: number;
  description: string;
  isTrending?: boolean;
  syllabus: { [key: string]: string[] };
  whyChooseEdizo: string[];
  benefits: string[];
}

// Fallback image map for each course
const fallbackImages: Record<string, string> = {
  'ui-ux-design': '/assets/images/web-design.png',
  'frontend-development': '/assets/images/responsive-design.png',
  'backend-development': '/assets/images/back-end.png',
  'hr-management': '/assets/images/hr-manager.png',
  'data-analytics': '/assets/images/content-strategy.png',
  'java-development': '/assets/images/java.png',
  'python-development': '/assets/images/python.png',
  'digital-marketing': '/assets/images/content-strategy.png',
  'ai-ml': '/assets/images/ai-assistant.png',
  'ai-with-chatgpt': '/assets/images/AI with CHATGPT.png',
  'web-development': '/assets/images/web-development.png',
  'csharp': '/assets/images/c-sharp.png',
  default: '/assets/images/default-internship.png' // Generic fallback
};

// Function to get image source with fallback
const getImageSrc = (id: string | undefined, image: string | undefined): string => {
  if (!id || !image) {
    console.warn(`Image not found for ID: ${id}, using default fallback`);
    return fallbackImages.default;
  }
  // Ensure the image path is absolute and starts with '/assets/images/'
  const normalizedImage = image.startsWith('/assets/images/') ? image : `/assets/images/${image.split('/').pop()}`;
  // Check if the image path is valid; otherwise, use fallback
  if (!normalizedImage.match(/^\/assets\/images\/[a-zA-Z0-9-]+\.(png|jpg|jpeg|webp)$/)) {
    console.warn(`Invalid image path for ID: ${id}, path: ${image}, using fallback`);
    return fallbackImages[id] || fallbackImages.default;
  }
  return normalizedImage;
};

// Reusable Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'default';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const variants: Record<string, string> = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400',
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Animated Section
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100, damping: 20 }}
  >
    {children}
  </motion.div>
);

const InternshipDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<string>('15-days');
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setInternship(null);
          setError('Internship ID not provided');
          setLoading(false);
          return;
        }

        // Type assertion to ensure TypeScript recognizes the structure
        const data = internshipsData as Record<string, Internship>;
        const selectedInternship = data[id];
        
        if (selectedInternship) {
          setInternship({ ...selectedInternship, id }); // Ensure id is included
          
          // Set default active period to first available period
          const periods = Object.keys(selectedInternship.syllabus);
          if (periods.length > 0 && !selectedInternship.syllabus[activePeriod]) {
            setActivePeriod(periods[0]);
          }
          setError(null);
        } else {
          setInternship(null);
          setError(`Internship with ID "${id}" not found`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load internship data');
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id, activePeriod]);

  // Preload the header image to improve performance
  useEffect(() => {
    if (internship) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getImageSrc(id, internship.image);
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [internship, id]);

  // Add JSON-LD structured data for SEO
  useEffect(() => {
    if (internship) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: internship.title,
        description: internship.description,
        provider: {
          '@type': 'Organization',
          name: internship.company,
          url: 'https://www.edizo.in'
        },
        category: internship.category,
        image: getImageSrc(id, internship.image),
        offers: {
          '@type': 'Offer',
          price: 'Free',
          priceCurrency: 'INR'
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'intern'
        },
        timeRequired: activePeriod,
        url: `https://www.edizo.in/internships/${internship.id}`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Inter',sans-serif] flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <p className="text-gray-600 mt-4">Loading internship details...</p>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-white font-['Inter',sans-serif] flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Internship Not Found</h1>
        <p className="text-lg text-gray-600 mt-2">{error || 'The internship you\'re looking for does not exist.'}</p>
        <Button
          onClick={() => navigate('/internships')}
          variant="outline"
          className="mt-6 border-red-600 text-red-600 hover:bg-red-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Internships
        </Button>
      </div>
    );
  }

  const syllabusPeriods = Object.keys(internship.syllabus);
  const currentSyllabus = internship.syllabus[activePeriod] || [];

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] pt-20 pb-16 px-4 md:px-6 lg:px-8">
      {/* Header Section with Image from JSON */}
      <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Image from JSON data */}
        <img
          src={getImageSrc(id, internship.image)}
          alt={`${internship.title} course banner`}
          className="w-full h-64 object-cover object-center"
          loading="lazy"
          onError={(e) => {
            console.warn(`Failed to load image for ID: ${id}, path: ${internship.image}`);
            e.currentTarget.src = fallbackImages[id] || fallbackImages.default;
          }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{internship.title}</h1>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              <Building2 size={16} />
              {internship.company}
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-700 text-white text-sm font-semibold px-3 py-1 rounded-full">
              <MapPin size={16} />
              {internship.mode}
            </span>
            {internship.isTrending && (
              <span className="inline-flex items-center gap-1 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                <TrendingUp size={16} />
                Trending
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <AnimatedSection>
          <button
            onClick={() => navigate('/internships')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm mb-6 transition-all duration-200 group focus:outline-none"
            aria-label="Go back to internships"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Internships</span>
          </button>
        </AnimatedSection>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-5">
                  <img
                    src={getImageSrc(id, internship.image)}
                    alt={`${internship.title} course thumbnail`}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                    loading="lazy"
                    onError={(e) => {
                      console.warn(`Failed to load thumbnail for ID: ${id}, path: ${internship.image}`);
                      e.currentTarget.src = fallbackImages[id] || fallbackImages.default;
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{internship.title}</h3>
                    <p className="text-gray-600 text-sm">{internship.category}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building2 className="text-red-600 mr-3" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Company</h4>
                      <p className="text-gray-600 text-sm">{internship.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {internship.mode === 'Online' ? (
                      <Wifi className="text-red-600 mr-3" size={20} />
                    ) : (
                      <Home className="text-red-600 mr-3" size={20} />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Mode</h4>
                      <p className="text-gray-600 text-sm">{internship.mode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-3" size={20} fill="currentColor" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Rating</h4>
                      <p className="text-gray-600 text-sm">{internship.rating} / 5.0</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Award className="text-green-600 mr-3" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Certification</h4>
                      <p className="text-gray-600 text-sm">100% Guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <Button
                onClick={() => navigate(`/apply/${id}`)}
                variant="primary"
                className="w-full text-base font-semibold py-4"
              >
                Apply Now →
              </Button>
            </AnimatedSection>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <AnimatedSection>
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Star className="text-red-600" size={24} />
                  About This Internship
                </h2>
              </div>
              <p className="text-gray-600 text-base leading-relaxed mt-3 bg-gray-50 p-6 rounded-lg border-l-4 border-red-600">
                {internship.description}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-red-600" size={24} />
                  Syllabus & Learning Path
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 mb-5">
                {syllabusPeriods.map((period) => (
                  <motion.button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                      activePeriod === period
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {period.replace('-', ' ').replace('days', ' Days').replace('month', ' Month').replace('months', ' Months')}
                  </motion.button>
                ))}
              </div>
              
              {currentSyllabus.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {activePeriod.replace('-', ' ').replace('days', ' Days').replace('month', ' Month').replace('months', ' Months')} Program
                  </h4>
                  <ul className="space-y-3">
                    {currentSyllabus.map((topic, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-start text-gray-600 text-sm p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
                          {index + 1}
                        </div>
                        <span>{topic}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <p className="text-gray-500 text-sm italic bg-yellow-測定50 p-4 rounded-lg border border-yellow-200">
                  No syllabus available for this program duration.
                </p>
              )}
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Star className="text-red-600" size={24} />
                  Why Choose {internship.company}?
                </h3>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <ul className="space-y-3">
                  {internship.whyChooseEdizo.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-start text-gray-600 text-sm p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
                    >
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check size={14} />
                      </div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-red-600" size={24} />
                  Career Benefits
                </h3>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <ul className="space-y-3">
                  {internship.benefits.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-start text-gray-600 text-sm p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
                    >
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check size={14} />
                      </div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>

            {/* CTA */}
            <AnimatedSection delay={0.4}>
              <div className="text-center pt-8">
                <Button
                  onClick={() => navigate(`/apply/${id}`)}
                  variant="primary"
                  className="px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg"
                >
                  Apply Now →
                </Button>
                <p className="text-gray-500 text-sm mt-3">
                  Limited seats • 100% Certification • Mentorship Included
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
