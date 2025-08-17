import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    CheckCircle,
    XCircle,
    Loader2,
    Send,
    Clock,
    IndianRupee,
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

// Input Field styling (common class for form inputs)
const inputFieldClasses = "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200";

// --- Course Period Pricing Configuration ---
const coursePeriods = [
    {
        value: "15days",
        label: "15 Days",
        price: 1599,
        description: "Quick introduction and basics"
    },
    {
        value: "1month",
        label: "1 Month", 
        price: 2999,
        description: "Comprehensive learning with projects",
        popular: true
    },
    {
        value: "2months",
        label: "2 Months",
        price: 4599,
        description: "In-depth training with real-world projects"
    },
    {
        value: "3months",
        label: "3 Months",
        price: 7999,
        description: "Complete mastery with industry exposure"
    }
];

// --- Internship Data Interface ---
interface Internship {
    title: string;
    category: string;
    mode: string;
    duration: string;
    department?: string; // Made optional
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

// Internship opportunity data
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
        description: 'Explore natural language processing, chatbot development, and prompt engineering using GPT-based models.',
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

// --- Main InternshipApplication Component ---
const InternshipApplication = () => {
    const { id } = useParams();
    const internshipId = id && id in internshipsData ? id : 'web-development';
    const internship = internshipsData[internshipId];

    // State to manage the application submission status
    const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
    // State to store and display submission messages to the user
    const [submissionMessage, setSubmissionMessage] = useState('');

    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        university: '', // New field for university/college name
        yearOfStudy: '', // New field for current year of study
        education: '', // Degree and Branch
        coursePeriod: '', // New field for course period
        academicExperience: '', // Changed from 'experience'
        message: '',
    });

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Get selected period details
    const getSelectedPeriodDetails = () => {
        return coursePeriods.find(period => period.value === formData.coursePeriod);
    };

    // Define the API base URL for your Render backend.
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Default to local backend

    // Log the API base URL being used for debugging
    console.log('Using API Base URL:', API_BASE_URL);

    // Handle form submission (directly sends email notifications)
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log('Attempting to submit form with data:', formData);
        setSubmissionStatus('processing');
        setSubmissionMessage('Sending your application and confirmation email...');

        const selectedPeriod = getSelectedPeriodDetails();

        try {
            // ✅ Step 1: Send confirmation email to applicant
            const applicantRes = await fetch(`${API_BASE_URL}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    internshipTitle: internship?.title || 'Internship',
                    coursePeriod: selectedPeriod?.label,
                    price: selectedPeriod?.price,
                }),
            });

            if (!applicantRes.ok) {
                const errorText = await applicantRes.text();
                console.warn('⚠️ Failed to send confirmation email to applicant:', applicantRes.status, errorText);
            } else {
                console.log('✅ Confirmation email sent to applicant.');
            }

            // ✅ Step 2: Send application notification to admin
            const adminRes = await fetch(`${API_BASE_URL}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    university: formData.university, // New field
                    yearOfStudy: formData.yearOfStudy, // New field
                    education: formData.education,
                    coursePeriod: selectedPeriod?.label,
                    price: selectedPeriod?.price,
                    academicExperience: formData.academicExperience, // Updated field
                    message: formData.message,
                    internshipTitle: internship?.title || 'Internship',
                }),
            });

            if (!adminRes.ok) {
                const errorText = await adminRes.text();
                throw new Error(`❌ Failed to notify admin: ${adminRes.status} - ${errorText}`);
            }

            console.log('✅ Application notification email sent to admin.');
            setSubmissionStatus('success');
            setSubmissionMessage('🎉 Application submitted successfully! A confirmation email has been sent to you.');

            // ✅ Reset the form
            setFormData({
                name: '',
                email: '',
                phone: '',
                university: '',
                yearOfStudy: '',
                education: '',
                coursePeriod: '',
                academicExperience: '',
                message: '',
            });
        } catch (error) {
            console.error('❌ Error in form submission:', error);
            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error: Could not connect to the server. Please check your internet connection and the server URL.';
            } else if (error instanceof Error) {
                errorMessage = `Submission failed: ${error.message}`;
            }

            setSubmissionStatus('error');
            setSubmissionMessage(errorMessage);
        }
    };

    const selectedPeriod = getSelectedPeriodDetails();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-16 px-4 font-sans">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
                <span className="text-red-600">{internship.title}</span> Application Form
            </h1>

            <section className="section bg-gray-100 w-full max-w-2xl"> {/* Adjusted max-w for form */}
                <div className="container-custom">
                    <AnimatedSection delay={0.2}>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                            {submissionStatus === 'idle' || submissionStatus === 'processing' ? (
                                <>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Apply Now</h3>
                                    <form onSubmit={handleFormSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className={inputFieldClasses}
                                                placeholder="Enter Name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className={inputFieldClasses}
                                                placeholder="Example@gmail.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={inputFieldClasses}
                                                placeholder="+91 12345 67890"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                                                University/College Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="university"
                                                name="university"
                                                value={formData.university}
                                                onChange={handleInputChange}
                                                required
                                                className={inputFieldClasses}
                                                placeholder="e.g., University of XYZ"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                                                Current Year of Study *
                                            </label>
                                            <select
                                                id="yearOfStudy"
                                                name="yearOfStudy"
                                                value={formData.yearOfStudy}
                                                onChange={handleInputChange}
                                                required
                                                className={inputFieldClasses}
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1st Year">1st Year</option>
                                                <option value="2nd Year">2nd Year</option>
                                                <option value="3rd Year">3rd Year</option>
                                                <option value="4th Year">4th Year</option>
                                                <option value="Postgraduate">Postgraduate</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                                                Degree and Branch *
                                            </label>
                                            <input
                                                type="text"
                                                id="education"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleInputChange}
                                                required
                                                className={inputFieldClasses}
                                                placeholder="e.g., B.Tech in Computer Science"
                                            />
                                        </div>

                                        {/* Course Period Selection */}
                                        <div>
                                            <label htmlFor="coursePeriod" className="block text-sm font-medium text-gray-700 mb-3">
                                                <Clock className="inline-block w-4 h-4 mr-1" />
                                                Select Course Period *
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {coursePeriods.map((period) => (
                                                    <div key={period.value} className="relative">
                                                        <input
                                                            type="radio"
                                                            id={period.value}
                                                            name="coursePeriod"
                                                            value={period.value}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="sr-only"
                                                        />
                                                        <label
                                                            htmlFor={period.value}
                                                            className={`relative flex flex-col p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                                                                formData.coursePeriod === period.value
                                                                    ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                                                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                            } ${period.popular ? 'ring-2 ring-blue-200 border-blue-400' : ''}`}
                                                        >
                                                            {period.popular && (
                                                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    Popular
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className="font-semibold text-gray-900">{period.label}</span>
                                                                <div className="flex items-center text-green-600 font-bold">
                                                                    <IndianRupee className="w-4 h-4" />
                                                                    <span>{period.price.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{period.description}</p>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            {selectedPeriod && (
                                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-green-800">
                                                            Selected: {selectedPeriod.label}
                                                        </span>
                                                        <div className="flex items-center text-green-700 font-bold">
                                                            <IndianRupee className="w-4 h-4 mr-1" />
                                                            <span>{selectedPeriod.price.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="academicExperience" className="block text-sm font-medium text-gray-700 mb-1">
                                                Academic Projects / Relevant Experience
                                            </label>
                                            <textarea
                                                id="academicExperience"
                                                name="academicExperience"
                                                value={formData.academicExperience}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className={`${inputFieldClasses} resize-none`}
                                                placeholder="Describe relevant academic projects, coursework, or any prior experience..."
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                Cover Letter
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className={`${inputFieldClasses} resize-none`}
                                                placeholder="Why are you interested in this internship and Edizo?"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            fullWidth
                                            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white"
                                            disabled={submissionStatus === 'processing'}
                                        >
                                            {submissionStatus === 'processing' ? (
                                                <Loader2 className="mr-2 animate-spin" size={18} />
                                            ) : (
                                                <Send className="mr-2" size={18} />
                                            )}
                                            Submit Application
                                            {selectedPeriod && (
                                                <span className="ml-2 text-sm">
                                                    (₹{selectedPeriod.price.toLocaleString()})
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                    {submissionStatus === 'processing' && (
                                        <div className="mt-4 text-center text-red-600 flex items-center justify-center">
                                            <Loader2 className="mr-2 animate-spin" size={20} /> {submissionMessage}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center py-6"
                                >
                                    <div className={`p-4 rounded-lg mb-4 ${submissionStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {submissionStatus === 'success' ? (
                                            <>
                                                <CheckCircle className="inline-block mr-2 text-green-600" size={24} />
                                                <p className="font-medium">Application Submitted Successfully!</p>
                                                <p className="text-sm mt-2">
                                                    Thank you for applying. A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>. Our team will contact you soon.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="inline-block mr-2 text-red-600" size={24} />
                                                <p className="font-medium">Application Submission Failed!</p>
                                                <p className="text-sm mt-2">
                                                    {submissionMessage} {/* Display specific error message */}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <Button variant="outline" onClick={() => {
                                        setSubmissionStatus('idle');
                                        setSubmissionMessage('');
                                    }}>
                                        Submit Another Application
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
};

export default InternshipApplication;
