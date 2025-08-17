import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wifi,
  Home,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Placeholder image URLs (to resolve compilation errors) ---
const placeholderImage = (text) => `https://placehold.co/150x150/E0E0E0/666666?text=${encodeURIComponent(text)}`;

// --- Reusable Components (Simplified for this example) ---

// Button component for consistent styling and behavior
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  fullWidth = false,
  className = '',
  disabled = false
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

// --- Internship Data Interface ---
interface Internship {
  title: string;
  category: string;
  mode: string;
  duration: string;
  department?: string; // Made optional as it's not in the provided data
  description: string;
  whyChooseEdizo: string[]; // New field
  benefits: string[];
  priceINR: number;
  image: string;
  rating: number;
  company: string;
}

// Define the common "Why Choose EDIZO?" content
const whyChooseEdizoContent = [
  "100% Internship Certification",
  "Real-Time, Hands-On Project for Each Course",
  "Learn from Experienced Industry Mentors",
  "Placement Guidance & Portfolio Support",
  "Flexible Duration: 15 Days to 3 Months",
  "Paid Internship Opportunities",
  "Modes: Online & Offline",
];

// Define the common "Benefits" content
const commonBenefits = [
  "Gain In-Demand Industry Skills",
  "Build Strong Resume with Real-Time Projects",
  "Improve Communication & Team Collaboration",
  "Internship Certificate Recognized by Companies",
  "Opportunity to Work on Live Client Projects",
  "Boost Confidence for Interviews & Job Roles",
  "Get Exposure to Professional Tools & Platforms",
];

// Internship opportunity data - 'keyTopics', 'responsibilities', and 'requirements' removed
const internshipsData: { [key: string]: Internship } = {
  'ui-ux-design': {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'Design',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('UI/UX'),
    rating: 4.7,
    company: 'InnovateTech Solutions',
    description: 'Work alongside our design team to create beautiful, intuitive user interfaces and improve user experiences.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'frontend-development': {
    id: 'frontend-development',
    title: 'Frontend Development',
    category: 'Development',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('Frontend'),
    rating: 4.5,
    company: 'WebCrafters Inc.',
    description: 'Gain hands-on experience in building responsive and interactive user interfaces using HTML, CSS, JavaScript, and modern frameworks like React. Learn design principles, UI/UX fundamentals, and how to turn designs into functioning web pages.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'backend-development': {
    id: 'backend-development',
    title: 'Backend Development',
    category: 'Development',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('Backend'),
    rating: 4.6,
    company: 'ServerSide Innovations',
    description: 'Understand the logic behind web applications by working with server-side technologies like Node.js, Express, and databases such as MySQL or MongoDB. Learn how APIs, authentication, and server architecture function in real-time environments.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'hr-management': {
    id: 'hr-management',
    title: 'HR Management',
    category: 'HR',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('HR'),
    rating: 4.2,
    company: 'PeopleFirst HR',
    description: 'Understand core HR functions such as recruitment, payroll, training, performance evaluation, and employee engagement. Learn to use HR tools and software while building real-world management skills.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'data-analytics': {
    id: 'data-analytics',
    title: 'Data Analytics',
    category: 'Data Science',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('DataAnalytics'),
    rating: 4.8,
    company: 'Insightful Data Co.',
    description: 'Gain proficiency in tools like Excel, Power BI, and Python for data cleaning, visualization, and reporting. Learn how to extract insights from raw data and make data-driven decisions in business contexts.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'java-development': {
    id: 'java-development',
    title: 'Java Development',
    category: 'Java',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('Java'),
    rating: 4.4,
    company: 'Enterprise Java Hub',
    description: 'Build a solid understanding of Java fundamentals, OOP concepts, and project structures. Gain experience in building desktop and web-based Java applications using tools like Eclipse or IntelliJ.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'python-development': {
    id: 'python-development',
    title: 'Python Programming',
    category: 'Python',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('Python'),
    rating: 4.6,
    company: 'Pythonic Solutions',
    description: 'Master the basics to advanced concepts in Python. Work on real-time projects involving automation, web scraping, and problem-solving. Ideal for building a strong programming foundation.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'Marketing',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('DigitalMarketing'),
    rating: 4.3,
    company: 'GrowthMarketers',
    description: 'Explore SEO, social media strategy, content marketing, Google Ads, and analytics tools. Gain practical insights into building brand presence, driving engagement, and generating leads through digital channels.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'ai-ml': {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    category: 'AI/ML',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('AI/ML'),
    rating: 4.9,
    company: 'Cognitive AI Labs',
    description: 'Delve into the world of intelligent systems by learning machine learning algorithms, model building, and deployment using Python libraries such as Scikit-learn, TensorFlow, or PyTorch. Work on datasets to solve real-world problems.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'ai-with-chatgpt': {
    id: 'ai-with-chatgpt',
    title: 'AI with ChatGPT',
    category: 'AI/ML',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('ChatGPT'),
    rating: 4.8,
    company: 'Conversational AI Co.',
    description: 'Learn how to integrate and build applications using OpenAIs ChatGPT and LLM APIs. Understand prompt engineering, natural language processing, and AI-assisted tools to automate and enhance workflows.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'web-development': {
    id: 'web-development',
    title: 'Web Development',
    category: 'Development',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('WebDev'),
    rating: 4.7,
    company: 'FullStack Devs',
    description: 'Get full-stack exposure by combining front-end and back-end skills. Build and deploy complete websites and web applications while learning Git, hosting, and project collaboration tools like GitHub.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
  'csharp': {
    id: 'csharp',
    title: 'C-Sharp',
    category: 'C#',
    mode: 'Online',
    duration: '15 days / 3 months',
    image: placeholderImage('C#'),
    rating: 4.5,
    company: '.NET Innovators',
    description: 'Learn fundamental syntax, object-oriented programming concepts, and .NET framework fundamentals using C# and related libraries.',
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
    priceINR: 4500,
  },
};

// --- Main InternshipDetails Component ---
const InternshipDetails = () => {
  const { id } = useParams(); // Specify type for useParams
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fallback to 'web-development' if ID is not found or invalid
  const internshipId = id && id in internshipsData ? id : 'web-development';
  const internship = internshipsData[internshipId];

  const handleApplyNowClick = () => {
    navigate(`/apply/${internshipId}`); // Navigate to the application page with internship ID
  };

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

  return (
    // Updated the top padding from py-16 to pt-32 to push the content down
    // and prevent it from overlapping with a fixed header.
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-32 px-4 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
        <span className="text-red-600">{internship.title}</span> Details
      </h1>

      <section className="section bg-gray-100 w-full max-w-6xl">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Internship Details Section */}
            <div className="lg:col-span-3"> {/* Changed to col-span-3 as form is removed */}
              <AnimatedSection>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Internship Overview</h2>
                <p className="text-lg text-gray-700 mb-8">{internship.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Duration Card */}
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center">
                      <Calendar className="text-red-500 mr-3" size={20} />
                      <div>
                        <h3 className="font-semibold text-gray-700">Duration</h3>
                        <p className="text-gray-600">{internship.duration}</p>
                      </div>
                    </div>
                  </div>
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
                  {/* Department Card - Removed as department is not in the new data structure */}
                  {/* You might want to add a department field to the internship data if needed */}
                </div>

                {/* Why Choose EDIZO? Section - NEW */}
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
