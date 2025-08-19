import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wifi,
  Home,
  Check,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Import internship data from the JSON file ---
// This assumes 'internships.json' is in the same directory.
// For the final build, this data would likely be fetched from an API.
import internshipsData from './internships.json';

// --- Reusable Components (Simplified for this example) ---

// Button component for consistent styling and behavior
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  fullWidth = false,
  className = '',
  disabled = false,
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    default: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  };
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className} ${disabledClasses}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// AnimatedSection component for smooth entrance animations
const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// --- Main InternshipDetails Component ---
const InternshipDetails = () => {
  // Use useParams hook to get the 'id' parameter from the URL
  const { id } = useParams();
  // Use useNavigate hook to programmatically navigate
  const navigate = useNavigate();

  // State to track the active syllabus period
  const [activePeriod, setActivePeriod] = useState('15-days');
  // State to hold the internship data
  const [internship, setInternship] = useState(null);

  useEffect(() => {
    // Check if the id exists in the imported data
    const selectedInternship = internshipsData[id];
    if (selectedInternship) {
      setInternship(selectedInternship);
    } else {
      // Handle invalid or missing ID by setting internship to null
      setInternship(null);
    }
  }, [id]);

  const handleApplyNowClick = () => {
    // Navigate to a mock application page. In a real app, this would be a more complex route.
    navigate(`/apply/${id}`);
  };

  // If internship data is not found, display a not found message
  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-16 px-4 font-sans">
        <h1 className="text-3xl font-bold text-gray-800">Internship Not Found</h1>
        <p className="text-lg text-gray-600 mt-4">The internship you are looking for does not exist.</p>
        <Button onClick={() => navigate('/internships')} className="mt-6">
          Back to Internships
        </Button>
      </div>
    );
  }

  // Get the keys for the syllabus periods to create the buttons
  const syllabusPeriods = Object.keys(internship.syllabus);

  // Get the syllabus for the currently active period
  const currentSyllabus = internship.syllabus[activePeriod];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-32 px-4 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
        <span className="text-red-600">{internship.title}</span> Details
      </h1>

      <section className="section bg-gray-100 w-full max-w-6xl">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Internship Details Section */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Internship Overview</h2>
                <p className="text-lg text-gray-700 mb-8">{internship.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Mode Card (Online/Offline) */}
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center">
                      {internship.mode === 'Online' ? (
                        <>
                          <Wifi className="text-red-500 mr-3" size={20} />
                          <div>
                            <h3 className="font-semibold text-gray-700">Mode</h3>
                            <p className="text-gray-600">Online</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Home className="text-red-500 mr-3" size={20} />
                          <div>
                            <h3 className="font-semibold text-gray-700">Mode</h3>
                            <p className="text-gray-600">Offline</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Rating Card */}
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center">
                      <Star className="text-yellow-500 mr-3" size={20} fill="currentColor" />
                      <div>
                        <h3 className="font-semibold text-gray-700">Rating</h3>
                        <p className="text-gray-600">{internship.rating} / 5.0</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Syllabus Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">📚 Syllabus</h3>
                  {/* Period Tabs */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {syllabusPeriods.map((period) => (
                      <Button
                        key={period}
                        onClick={() => setActivePeriod(period)}
                        variant={activePeriod === period ? 'primary' : 'outline'}
                        className="capitalize"
                      >
                        {period.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>

                  {currentSyllabus ? (
                    <motion.ul
                      key={activePeriod} // Key prop to trigger re-animation on state change
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-6 rounded-lg shadow-inner"
                    >
                      {currentSyllabus.map((topic, index) => (
                        <li key={index} className="flex items-start text-gray-700 py-2 border-b border-gray-100 last:border-b-0">
                          <Check className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </motion.ul>
                  ) : (
                    <p className="text-gray-500 italic">No syllabus available for this duration.</p>
                  )}
                </div>

                {/* Why Choose EDIZO? Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Why Choose EDIZO?</h3>
                  <ul className="space-y-3">
                    {internship.whyChooseEdizo.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <Check className="text-red-500 mr-2 mt-1 flex-shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    {internship.benefits.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <Check className="text-red-500 mr-2 mt-1 flex-shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Now Button */}
                <div className="flex justify-center mt-10">
                  <Button
                    onClick={handleApplyNowClick}
                    variant="primary"
                    className="px-8 py-4 text-xl"
                  >
                    Apply Now
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternshipDetails;
