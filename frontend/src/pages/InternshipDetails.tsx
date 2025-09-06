import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wifi,
  Home,
  Check,
  Star,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Define the Internship interface
interface Internship {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  rating: number;
  description: string;
  isTrending?: boolean;
  syllabus: {
    [key: string]: string[];
  };
  whyChooseEdizo: string[];
  benefits: string[];
  // Add any other properties your internship data might have
}

// Mock data - replace with your actual import if needed
// import internshipsData from './internships.json';
const internshipsData: Record<string, Internship> = {
  // Your internship data would go here
  // This is just a placeholder for type safety
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
  className = '' 
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
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const InternshipDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<string>('15-days');
  const [internship, setInternship] = useState<Internship | null>(null);

  useEffect(() => {
    if (!id) {
      setInternship(null);
      return;
    }
    
    const selectedInternship = internshipsData[id];
    if (selectedInternship) {
      setInternship(selectedInternship);
      // Set default active period to first available period
      const periods = Object.keys(selectedInternship.syllabus);
      if (periods.length > 0 && !selectedInternship.syllabus[activePeriod]) {
        setActivePeriod(periods[0]);
      }
    } else {
      setInternship(null);
    }
  }, [id, activePeriod]);

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Internship Not Found</h1>
        <p className="text-lg text-gray-600 mt-2">The internship you're looking for does not exist.</p>
        <Button
          onClick={() => navigate('/internships')}
          variant="outline"
          className="mt-6"
        >
          ← Back to Internships
        </Button>
      </div>
    );
  }

  const syllabusPeriods = Object.keys(internship.syllabus);
  const currentSyllabus = internship.syllabus[activePeriod] || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-6 lg:px-8">
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

        {/* Title & Trending Badge */}
        <AnimatedSection>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{internship.title}</h1>
            {internship.isTrending && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full mt-2">
                <TrendingUp size={16} className="text-yellow-600" />
                Trending
              </span>
            )}
          </div>
        </AnimatedSection>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                {internship.mode === 'Online' ? (
                  <>
                    <Wifi className="text-red-500 mr-3" size={20} />
                    <div>
                      <h3 className="font-medium text-gray-700">Mode</h3>
                      <p className="text-gray-600 text-sm">Online</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Home className="text-red-500 mr-3" size={20} />
                    <div>
                      <h3 className="font-medium text-gray-700">Mode</h3>
                      <p className="text-gray-600 text-sm">Offline</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-3" size={20} fill="currentColor" />
                <div>
                  <h3 className="font-medium text-gray-700">Rating</h3>
                  <p className="text-gray-600 text-sm">{internship.rating} / 5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
              <p className="text-gray-700 leading-relaxed mt-3">{internship.description}</p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h3 className="text-2xl font-bold text-gray-800">📚 Syllabus</h3>
              <div className="flex flex-wrap gap-3 mt-4 mb-5">
                {syllabusPeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all
                      ${activePeriod === period
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {period.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {currentSyllabus.length > 0 ? (
                <ul className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                  {currentSyllabus.map((topic, index) => (
                    <li key={index} className="flex items-start text-gray-700 text-sm">
                      <Check className="text-red-500 mr-3 mt-1 flex-shrink-0" size={16} />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No syllabus available.</p>
              )}
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h3 className="text-2xl font-bold text-gray-800">🎯 Why Choose EDIZO?</h3>
              <ul className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                {internship.whyChooseEdizo.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700 text-sm">
                    <Check className="text-red-500 mr-3 mt-1 flex-shrink-0" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <h3 className="text-2xl font-bold text-gray-800">🌟 Benefits</h3>
              <ul className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                {internship.benefits.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700 text-sm">
                    <Check className="text-red-500 mr-3 mt-1 flex-shrink-0" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button
                onClick={() => navigate(`/apply/${id}`)}
                variant="primary"
                className="px-10 py-4 text-lg font-semibold"
              >
                Apply Now →
              </Button>
              <p className="text-gray-500 text-sm mt-3">
                Limited seats • 100% Certification • Mentorship Included
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;