// InternshipDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Wifi, Home, Check, Star, TrendingUp, ArrowLeft, Building2, MapPin, Calendar, Award, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// === Define Interfaces ===
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
  whyChooseEdizo: string[];
  benefits: string[];
  syllabus: {
    '15-days': string[];
    '1-month': string[];
    '2-months': string[];
    '3-months': string[];
  };
}

// Fallback image map
const fallbackImages: Record<string, string> = {
  'ui-ux-design': '/assets/images/web-design.png',
  'frontend-development': '/assets/images/responsive-design.png',
  'backend-development': '/assets/images/back-end.png',
  'hr-management': '/assets/images/hr-manager.png',
  'data-analytics': '/assets/images/data-Analytics.png',
  'java-development': '/assets/images/java.png',
  'python-development': '/assets/images/python.png',
  'digital-marketing': '/assets/images/content-strategy.png',
  'ai-ml': '/assets/images/ai-assistant.png',
  'ai-with-chatgpt': '/assets/images/AI with CHATGPT.png',
  'web-development': '/assets/images/web-development.png',
  'csharp': '/assets/images/c-sharp.png',
  default: 'https://via.placeholder.com/800x400?text=Internship+Image',
};

// Image source function
const getImageSrc = (id: string | undefined, image: string | undefined): string => {
  if (image && (image.startsWith('/') || image.startsWith('http'))) {
    return image;
  }
  if (id && fallbackImages[id]) {
    return fallbackImages[id];
  }
  return fallbackImages.default;
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  variant?: 'primary' | 'outline' | 'default';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, to, variant = 'default', className = '', disabled = false }) => {
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 focus:ring-red-500 shadow-md',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };

  const baseClasses = `px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses} disabled={disabled}>
      {children}
    </button>
  );
};

// Animated Section Component
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

// Main Component
const InternshipDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<string>('15-days');
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch internship details from Google Sheets
  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError('Internship ID not provided');
          setLoading(false);
          return;
        }

        const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
        const SHEET_NAME = import.meta.env.VITE_INTERNSHIPS_SHEET_NAME || 'Internships';
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

        console.log('Fetching internship details for ID:', id);

        if (!SHEET_ID || !API_KEY) {
          throw new Error('Missing Google Sheets configuration');
        }

        // Fetch from Google Sheets
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch data');
        }

        const data = await response.json();

        if (!data.values || data.values.length <= 1) {
          throw new Error('No data found in sheet');
        }

        // Find the internship by ID (column 0)
        const internshipRow = data.values.slice(1).find((row: any[]) => row[0] === id);

        if (!internshipRow) {
          setError(`Internship with ID "${id}" not found`);
          setInternship(null);
          setLoading(false);
          return;
        }

        // Parse the row data (based on Table 2 structure)
        const parsedInternship: Internship = {
          id: internshipRow[0] || id,
          title: internshipRow[1] || 'Untitled',
          category: internshipRow[2] || 'General',
          mode: (internshipRow[3] || 'Online') as 'Online' | 'Offline',
          company: internshipRow[4] || 'EDIZO',
          image: internshipRow[5] || '',
          rating: parseFloat(internshipRow[6]) || 4.0,
          description: internshipRow[7] || 'No description available.',
          whyChooseEdizo: [
            internshipRow[8] || '',
            internshipRow[9] || '',
            internshipRow[10] || '',
            internshipRow[11] || '',
            internshipRow[12] || '',
            internshipRow[13] || '',
            internshipRow[14] || '',
          ].filter(Boolean),
          benefits: [
            internshipRow[15] || '',
            internshipRow[16] || '',
            internshipRow[17] || '',
            internshipRow[18] || '',
            internshipRow[19] || '',
            internshipRow[20] || '',
            internshipRow[21] || '',
          ].filter(Boolean),
          syllabus: {
            '15-days': internshipRow[22] ? internshipRow[22].split(',').map((s: string) => s.trim()) : [],
            '1-month': internshipRow[23] ? internshipRow[23].split(',').map((s: string) => s.trim()) : [],
            '2-months': internshipRow[24] ? internshipRow[24].split(',').map((s: string) => s.trim()) : [],
            '3-months': internshipRow[25] ? internshipRow[25].split(',').map((s: string) => s.trim()) : [],
          },
          isTrending: parseFloat(internshipRow[6]) >= 4.5,
        };

        console.log('Parsed internship:', parsedInternship);
        setInternship(parsedInternship);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching internship details:', err);
        setError(err.message || 'Failed to load internship details');
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipDetails();
  }, [id]);

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center py-20 px-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center justify-center py-20 px-6">
        <div className="text-center max-w-lg">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Internship Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">{error || "The internship you're looking for does not exist."}</p>
          <Button onClick={() => navigate('/internships')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2 inline" /> Back to Internships
          </Button>
        </div>
      </div>
    );
  }

  const syllabusPeriods = Object.keys(internship.syllabus).filter(period => internship.syllabus[period as keyof typeof internship.syllabus].length > 0);
  const currentSyllabus = internship.syllabus[activePeriod as keyof typeof internship.syllabus] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pt-20 pb-16 px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-t-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={getImageSrc(id, internship.image)}
          alt={`${internship.title} course banner`}
          className="w-full h-64 object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImages.default;
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
          <Link
            to="/internships"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm mb-6 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Internships</span>
          </Link>
        </AnimatedSection>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-5">
                  <img
                    src={getImageSrc(id, internship.image)}
                    alt={`${internship.title} thumbnail`}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages.default;
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
              <Button to={`/apply/${id}`} variant="primary" className="w-full text-base font-semibold py-4">
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
              <p className="text-gray-600 text-base leading-relaxed mt-3 bg-gray-50 p-6 rounded-xl border-l-4 border-red-600">
                {internship.description}
              </p>
            </AnimatedSection>

            {/* Syllabus Section */}
            {syllabusPeriods.length > 0 && (
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
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
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
                  <p className="text-gray-500 text-sm italic bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    No syllabus available for this duration.
                  </p>
                )}
              </AnimatedSection>
            )}

            {/* Why Choose Section */}
            {internship.whyChooseEdizo.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="flex items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-red-600" size={24} />
                    Why Choose {internship.company}?
                  </h3>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
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
            )}

            {/* Benefits Section */}
            {internship.benefits.length > 0 && (
              <AnimatedSection delay={0.3}>
                <div className="flex items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Zap className="text-red-600" size={24} />
                    Career Benefits
                  </h3>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
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
            )}

            {/* CTA */}
            <AnimatedSection delay={0.4}>
              <div className="text-center pt-8 bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h3>
                <Button to={`/apply/${id}`} variant="primary" className="px-10 py-4 text-lg font-semibold text-white shadow-lg">
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
