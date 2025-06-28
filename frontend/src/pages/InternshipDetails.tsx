import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wifi,
  Home,
  Check,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Placeholder image URLs (to resolve compilation errors) ---
// These are used instead of local image imports.
const placeholderImage = (text: string | number | boolean) => `https://placehold.co/150x150/E0E0E0/666666?text=${encodeURIComponent(text)}`;

// --- Reusable Components ---

/**
 * Button component with primary, outline, and default variants.
 * Supports full width and disabled states.
 */
const Button = ({ children, onClick, type = 'button', variant = 'default', fullWidth = false, className = '', disabled = false }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 hover:border-red-500",
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

/**
 * AnimatedSection component for fade-in and slide-up animations.
 */
const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // Start slightly lower and invisible
      animate={{ opacity: 1, y: 0 }}   // Animate to full opacity and original position
      transition={{ duration: 0.6, delay, ease: "easeOut" }} // Smooth transition
      className="rounded-lg" // Add a class for consistent rounding if needed
    >
      {children}
    </motion.div>
  );
};

// Input Field styling (common class for form inputs)
const inputFieldClasses = "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:border-red-400";

// --- Internship Data (with placeholder images and rich content) ---
const internshipsData = {
  'ui-ux-design': {
    title: 'UI/UX Design Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Computer Science',
    description:
      'Immerse yourself in the world of user-centered design! Work alongside our expert design team to craft stunning, intuitive user interfaces and elevate overall user experiences for our diverse product portfolio.',
    responsibilities: [
      'Collaborate on creating impactful wireframes, interactive mockups, and functional prototypes.',
      'Conduct insightful user research and meticulous usability testing to inform design decisions.',
      'Design cutting-edge responsive interfaces optimized for both web and mobile applications.',
      'Develop and refine visual assets and intricate design elements, maintaining brand consistency.',
      'Work hand-in-hand with development teams to ensure seamless implementation of design concepts.',
      'Actively participate in dynamic design thinking workshops and engaging brainstorming sessions.',
    ],
    requirements: [
      'Currently pursuing a degree in Design, Human-Computer Interaction (HCI), or a closely related field.',
      'Demonstrated proficiency with industry-standard design tools such as Figma, Adobe XD, or Sketch.',
      'A solid understanding of foundational user-centered design principles and methodologies.',
      'Basic command of HTML/CSS for effective communication with developers.',
      'Possess strong visual design skills, an exceptional eye for detail, and a passion for aesthetics.',
      'Ability to both give and graciously receive constructive feedback, fostering a collaborative environment.',
    ],
    benefits: [
      'Receive a competitive monthly stipend, acknowledging your valuable contributions.',
      'Enjoy flexible working hours, promoting a healthy work-life balance.',
      'Embrace the freedom of remote work options, allowing you to contribute from anywhere.',
      'Benefit from personalized mentorship directly from senior designers, accelerating your growth.',
      'Engage in portfolio-worthy projects that will showcase your skills to future employers.',
      'Unlock invaluable networking opportunities with leading industry professionals and thought leaders.',
    ],
    priceINR: 4500,
    image: placeholderImage('UI/UX')
  },
  'frontend-development': {
    title: 'Frontend Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Computer Science',
    description:
      'Dive deep into modern web development! You\'ll be building highly responsive and dynamic web applications using cutting-edge frontend technologies like React, Vue.js, and TypeScript, contributing to user-facing experiences.',
    responsibilities: [
      'Assist in the comprehensive development of responsive and high-performance web applications.',
      'Implement visually appealing and functional UI components leveraging modern frontend frameworks.',
      'Seamlessly integrate frontend with backend APIs and various database systems.',
      'Actively participate in collaborative code reviews and productive team meetings.',
      'Proactively debug and resolve issues within existing applications, ensuring smooth operation.',
      'Collaborate closely with designers to meticulously translate UI/UX designs into code.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, Software Engineering, or a related technical field.',
      'Demonstrable knowledge of core web technologies: HTML, CSS, and JavaScript.',
      'Familiarity with at least one popular frontend framework: React, Vue, or Angular.',
      'A basic understanding of how REST APIs function and are consumed.',
      'Possess strong problem-solving skills, meticulous attention to detail, and a logical approach.',
      'Exhibit strong communication and teamwork abilities, thriving in a collaborative setting.',
    ],
    benefits: [
      'Receive a competitive monthly stipend to support your learning journey.',
      'Benefit from flexible working hours, accommodating your academic schedule.',
      'Leverage remote work options, providing convenience and flexibility.',
      'Gain invaluable mentorship from experienced senior developers, guiding your career path.',
      'Seize the opportunity to work on real, impactful projects that challenge and grow your skills.',
      'Expand your professional network through engagement with industry professionals and peers.',
    ],
    priceINR: 4500,
    image: placeholderImage('Frontend')
  },
  'backend-development': {
    title: 'Backend Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Computer Science',
    description:
      'Become a core part of our engineering team by building robust and scalable backend systems. You\'ll work with technologies like Node.js, Django, or Spring Boot, managing databases and designing efficient APIs.',
    responsibilities: [
      'Construct scalable and high-performance backend systems utilizing Node.js, Django, or Spring Boot.',
      'Engage in comprehensive database management and API integration tasks.',
      'Efficiently debug and resolve complex backend issues, ensuring system stability.',
      'Produce clean, maintainable, secure, and well-documented code.',
      'Collaborate effectively with frontend developers to ensure seamless API integration.',
      'Adhere to industry best practices for security, performance, and code quality.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, Information Technology, or a related field.',
      'Proficiency in at least one backend programming language (Node.js, Python, Java).',
      'Hands-on experience with various database systems (SQL or NoSQL).',
      'A solid understanding of RESTful API development principles and best practices.',
      'Exceptional problem-solving skills and a keen eye for detail.',
      'Demonstrated team collaboration and effective communication abilities.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your dedicated efforts.',
      'Benefit from flexible working hours to balance your commitments.',
      'Enjoy the convenience and freedom of remote work options.',
      'Gain specialized mentorship from seasoned backend engineers.',
      'Acquire real-world project experience, solving complex technical challenges.',
      'Expand your professional network by connecting with tech leaders and innovators.',
    ],
    priceINR: 4500,
    image: placeholderImage('Backend')
  },
  'web-development': {
    title: 'Web Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Computer Science',
    description:
      'Gain invaluable practical experience in building comprehensive full-stack web applications. You\'ll master modern frameworks and tools, taking projects from concept to deployment.',
    responsibilities: [
      'Develop end-to-end full-stack web applications, from user interface to database.',
      'Work proficiently with both frontend (e.g., React, Vue) and backend (e.g., Node.js, Python) technologies.',
      'Implement highly responsive and intuitive UI/UX designs, ensuring cross-device compatibility.',
      'Manage database interactions and deployment on various cloud hosting platforms.',
      'Thoroughly debug, test, and optimize applications for performance and reliability.',
      'Collaborate effectively with designers, product managers, and other stakeholders.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science or a closely related technical field.',
      'Foundational familiarity with web development basics (HTML, CSS, JavaScript).',
      'Demonstrable experience with either a frontend (React, Vue) or backend (Node, Python) framework.',
      'A basic understanding of Git and modern version control systems.',
      'Strong analytical and problem-solving skills, with an aptitude for learning new technologies.',
      'Excellent communication and teamwork abilities, fostering a productive environment.',
    ],
    benefits: [
      'Receive a competitive monthly stipend to support your professional development.',
      'Enjoy the flexibility of remote work options, balancing your personal and professional life.',
      'Gain hands-on experience with real client projects, building a robust portfolio.',
      'Expand your professional network by interacting with experienced engineering teams and industry experts.',
      'Benefit from comprehensive mentorship from senior developers, guiding your growth.',
      'Opportunity to contribute to open-source projects or internal tools, enhancing your skill set.',
    ],
    priceINR: 4500,
    image: placeholderImage('WebDev')
  },
  'digital-marketing': {
    title: 'Digital Marketing Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Marketing',
    description:
      'Ignite your career in digital marketing! Gain hands-on experience in essential areas like SEO, engaging content marketing, dynamic social media strategy, and insightful campaign analytics.',
    responsibilities: [
      'Actively assist with the creation and strategic scheduling of compelling social media content.',
      'Contribute to the development and successful implementation of impactful marketing campaigns.',
      'Rigorously analyze campaign performance metrics and generate comprehensive reports.',
      'Conduct in-depth market research and competitive analysis to identify opportunities.',
      'Provide robust support for various email marketing initiatives and automation.',
      'Play a key role in developing and optimizing SEO and content marketing strategies.',
    ],
    requirements: [
      'Currently pursuing a degree in Marketing, Communications, Business, or a related field.',
      'A fundamental understanding of core digital marketing principles and concepts.',
      'Practical experience with major social media platforms and content creation.',
      'Basic knowledge of Search Engine Optimization (SEO) and content marketing best practices.',
      'Possess a strong analytical mindset, excellent organizational skills, and attention to detail.',
      'Exhibit strong written and verbal communication skills, with a flair for creativity.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your dedicated contributions.',
      'Enjoy flexible working hours, allowing for better personal and academic balance.',
      'Embrace the convenience of remote work options, fostering productivity from anywhere.',
      'Gain direct mentorship from seasoned marketing professionals, accelerating your expertise.',
      'Acquire hands-on experience with industry-standard marketing tools and platforms.',
      'Cultivate valuable networking opportunities with industry professionals and leaders.',
    ],
    priceINR: 4500,
    image: placeholderImage('DigitalMarketing')
  },
  'java-development': {
    title: 'Java Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Computer Science',
    description:
      'Step into the realm of enterprise-level Java development! You\'ll learn to build robust applications using powerful frameworks like Spring Boot and Hibernate, contributing to real-world software solutions.',
    responsibilities: [
      'Work on complex enterprise Java applications utilizing Spring Boot and Hibernate frameworks.',
      'Assist in the design, development, and enhancement of scalable microservices.',
      'Participate actively in debugging and resolving intricate backend issues.',
      'Collaborate seamlessly with cross-functional teams, including frontend and QA.',
      'Write comprehensive unit tests and engage in constructive code reviews.',
      'Adhere to agile methodologies and actively participate in sprint planning and stand-ups.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, Software Engineering, or a related technical discipline.',
      'Strong foundational knowledge of Java and object-oriented programming (OOP) principles.',
      'Familiarity with Spring Boot or Hibernate is a significant advantage.',
      'A basic understanding of RESTful APIs and inter-service communication.',
      'Possess strong problem-solving skills and an analytical approach to complex challenges.',
      'Exhibit excellent written and verbal communication skills for effective team collaboration.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your dedicated contributions.',
      'Enjoy flexible working hours, promoting a healthy work-life integration.',
      'Embrace the freedom and convenience of remote work options.',
      'Gain specialized mentorship from experienced Java developers, accelerating your learning.',
      'Acquire direct exposure to enterprise-level application architecture and design patterns.',
      'Unlock valuable networking opportunities with seasoned IT professionals and engineers.',
    ],
    priceINR: 4500,
    image: placeholderImage('Java')
  },
  'python-development': {
    title: 'Python Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Computer Science',
    description:
      'Unleash the power of Python! Explore exciting areas like scripting, automation, and backend development. You\'ll work with various Python libraries and frameworks to build innovative solutions.',
    responsibilities: [
      'Develop efficient scripts and robust automation tools to streamline processes.',
      'Construct scalable backend services using popular Python frameworks (e.g., Django, Flask).',
      'Work extensively with APIs and manage complex database integrations.',
      'Thoroughly test and debug Python-based applications, ensuring high quality.',
      'Collaborate effectively with data scientists and machine learning engineers on joint projects.',
      'Meticulously document processes, code, and project specifications.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, Data Science, or a related quantitative field.',
      'Demonstrated proficiency in Python programming, including data structures and algorithms.',
      'Familiarity with backend frameworks like Django or Flask is highly beneficial.',
      'A clear understanding of RESTful APIs and JSON data exchange formats.',
      'Possess strong logical reasoning and algorithmic thinking skills.',
      'Exhibit good communication and teamwork abilities, thriving in a collaborative environment.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your valuable contributions.',
      'Enjoy flexible working hours, supporting a balanced lifestyle.',
      'Embrace the convenience and flexibility of remote work options.',
      'Gain expert mentorship from senior Python developers, accelerating your skill development.',
      'Acquire hands-on exposure to real-world projects, building a practical portfolio.',
      'Cultivate invaluable networking opportunities with experienced engineering teams.',
    ],
    priceINR: 4500,
    image: placeholderImage('Python')
  },
  'hr-management': {
    title: 'HR Management Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Human Resources',
    description:
      'Step into the dynamic world of Human Resources! You\'ll gain practical experience by assisting in key HR functions, including recruitment, seamless onboarding, vibrant employee engagement, and effective performance management.',
    responsibilities: [
      'Actively assist in the recruitment process, including resume screening and interview scheduling.',
      'Manage and optimize the end-to-end employee onboarding process for new hires.',
      'Provide comprehensive support for internal employee engagement and wellness initiatives.',
      'Accurately maintain HR records, confidential documentation, and employee databases.',
      'Coordinate various training programs, workshops, and company events.',
      'Gain hands-on experience working with HR software and information systems.',
    ],
    requirements: [
      'Currently pursuing a degree in Human Resources, Business Administration, or a related field.',
      'A foundational understanding of core HR practices, policies, and procedures.',
      'Possess strong organizational skills, meticulous attention to detail, and excellent communication abilities.',
      'Proficiency with Microsoft Office Suite (Word, Excel, PowerPoint) and general office tools.',
      'Demonstrated ability to handle confidential and sensitive information with the utmost professionalism and discretion.',
      'Exhibit a detail-oriented, proactive, and empathetic attitude.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your dedicated contributions.',
      'Enjoy flexible working hours, supporting a balanced work and personal life.',
      'Embrace the convenience and accessibility of remote work options.',
      'Gain personalized mentorship from seasoned HR professionals, accelerating your growth.',
      'Acquire hands-on experience in diverse human resources functions, building a practical skill set.',
      'Cultivate valuable networking opportunities within the company and the broader HR community.',
    ],
    priceINR: 4500,
    image: placeholderImage('HR')
  },
  'data-analytics': {
    title: 'Data Analytics Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Data Science',
    description:
      'Transform raw data into actionable insights! As a Data Analytics Intern, you\'ll analyze real-world datasets, generate compelling reports, and directly support strategic business decision-making using powerful tools like Python, SQL, and Tableau.',
    responsibilities: [
      'Collect, clean, and analyze complex datasets from various internal and external sources.',
      'Create insightful reports and compelling data visualizations to effectively communicate findings.',
      'Provide data-driven support for decision-making processes across different departments.',
      'Assist in the implementation and meticulous maintenance of robust data tracking systems.',
      'Help identify key trends, patterns, and anomalies in customer behavior and operational data.',
      'Contribute to the development of predictive modeling and forecasting initiatives.',
    ],
    requirements: [
      'Currently pursuing a degree in Statistics, Data Science, Computer Science, or a related quantitative field.',
      'Demonstrated experience with data analysis tools such as Python (Pandas, NumPy), R, or Excel.',
      'A solid basic understanding of SQL and relational database concepts.',
      'Knowledge of data visualization techniques and tools (e.g., Matplotlib, Seaborn, Tableau, Power BI).',
      'Possess strong analytical and problem-solving skills, with an aptitude for critical thinking.',
      'Exceptional attention to detail and proven ability to work effectively with complex datasets.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your contributions to data insights.',
      'Enjoy flexible working hours, supporting a balanced academic and professional schedule.',
      'Embrace the convenience and collaboration of remote work options.',
      'Gain personalized mentorship from experienced senior data analysts.',
      'Access and utilize cutting-edge data analysis tools and platforms.',
      'Cultivate valuable networking opportunities with industry professionals and data experts.',
    ],
    priceINR: 4500,
    image: placeholderImage('DataAnalytics')
  },
  'ai-ml': {
    title: 'AI & Machine Learning Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Artificial Intelligence',
    description:
      'Pioneer the future with us! Work on cutting-edge machine learning models, intricate deep learning projects, and solve real-world AI use cases, contributing to intelligent systems.',
    responsibilities: [
      'Design, build, and rigorously train various machine learning models.',
      'Implement and optimize deep learning solutions for specific challenges.',
      'Work extensively with large and complex datasets, including preprocessing and feature engineering.',
      'Collaborate seamlessly with data science and engineering teams on integrated projects.',
      'Research, evaluate, and apply the latest advancements in AI algorithms and techniques.',
      'Present findings, insights, and contribute to the development of AI-powered products.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, Data Science, Artificial Intelligence, or a related quantitative field.',
      'Proficiency in Python and core ML/DL libraries (e.g., Pandas, Scikit-learn, TensorFlow, PyTorch).',
      'A deep understanding of supervised, unsupervised, and reinforcement learning paradigms.',
      'Experience with development environments like Jupyter Notebooks or Google Colab.',
      'Possess a strong mathematical foundation in linear algebra, calculus, and statistics.',
      'Demonstrated curiosity, a passion for AI, and an eagerness to explore emerging technologies.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your contributions to AI innovation.',
      'Enjoy flexible working hours, accommodating your academic and personal commitments.',
      'Embrace the convenience and collaboration of remote work options.',
      'Gain invaluable mentorship directly from experienced AI researchers and engineers.',
      'Acquire hands-on experience with state-of-the-art AI models and methodologies.',
      'Cultivate unparalleled networking opportunities with top AI professionals and thought leaders.',
    ],
    priceINR: 4500,
    image: placeholderImage('AI/ML')
    },
  'ai-with-chatgpt': {
    title: 'AI with ChatGPT Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Artificial Intelligence',
    description:
      'Become a pioneer in conversational AI! You\'ll explore natural language processing (NLP), cutting-edge chatbot development, and master prompt engineering using advanced GPT-based models.',
    responsibilities: [
      'Design, develop, and deploy intelligent chatbots and conversational agents.',
      'Fine-tune Large Language Models (LLMs) and expertly optimize prompts for desired outputs.',
      'Integrate sophisticated NLP models into various applications and workflows.',
      'Rigorously evaluate model performance, accuracy, and identify areas for improvement.',
      'Collaborate closely with AI engineers, product teams, and UX designers.',
      'Contribute significantly to ongoing AI research and drive innovation in language models.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, AI, Computational Linguistics, or a related field.',
      'A strong understanding of Natural Language Processing (NLP) concepts and Large Language Models (LLMs).',
      'Demonstrated experience with Python and relevant machine learning libraries.',
      'Familiarity with NLP frameworks such as Hugging Face Transformers or LangChain is a plus.',
      'Possess strong analytical, problem-solving, and technical skills.',
      'Exhibit a deep passion for AI, language models, and their real-world applications.',
    ],
    benefits: [
      'Receive a competitive monthly stipend for your contributions to conversational AI.',
      'Enjoy flexible working hours, supporting a balanced academic and professional life.',
      'Embrace the convenience and collaboration of remote work options.',
      'Gain expert mentorship directly from seasoned NLP specialists and AI architects.',
      'Acquire hands-on exposure to state-of-the-art AI technologies and models.',
      'Cultivate valuable networking opportunities with leading AI and chatbot specialists.',
    ],
    priceINR: 4500,
    image: placeholderImage('ChatGPT')
  },
  'Csharp': {
    title: 'C-Sharp Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '3 months',
    department: 'Computer Science',
    description:
      'Master C# development! Learn fundamental syntax, core object-oriented programming concepts, and delve into the .NET framework fundamentals. You\'ll build applications using C# and related libraries.',
    responsibilities: [
      'Assist in developing robust applications using C# and the .NET framework, spanning desktop, web, and cloud.',
      'Collaborate closely with the development team to design, develop, test, and deploy new features and enhancements.',
      'Write clean, well-documented, and efficient code adhering to best practices and OOP principles.',
      'Work with various database systems (e.g., SQL Server, Cosmos DB) and implement data access logic using ORMs like Entity Framework.',
      'Actively participate in team workflows, including version control (Git), Agile processes, and rigorous code reviews.',
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, Software Engineering, or a related technical field.',
      'Familiarity with the Visual Studio integrated development environment.',
      'Possess strong logical reasoning and algorithmic thinking skills.',
      'Exhibit good communication and teamwork abilities, fostering a productive environment.',
      'Prior experience in C# programming is highly appreciated.',
      'A foundational understanding of the .NET framework and its ecosystem is beneficial.',
    ],
    benefits: [
      'Develop a strong understanding of C# syntax and set up a productive development environment.',
      'Master C# fundamentals, including variables, data types, operators, and control flow.',
      'Implement control structures such as if statements, for loops, and while loops for logical flow.',
      'Comprehend and effectively apply object-oriented programming (OOP) concepts: classes, objects, inheritance, polymorphism, and encapsulation.',
      'Create and utilize methods to modularize and organize your code, enhancing readability and maintainability.',
      'Implement robust error handling mechanisms (try-catch) to manage exceptions gracefully.',
      'Gain practical experience in writing, compiling, and running C# programs.',
    ],
    priceINR: 4500,
    image: placeholderImage('C#')
  },
};

// --- Main InternshipDetails Component ---
const InternshipDetails = () => {
  const { id } = useParams();
  const internshipId = id && id in internshipsData ? id : 'web-development'; // Default to web-development if ID is invalid
  const internship = internshipsData[internshipId];

  // State for form submission status and messages
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [submissionMessage, setSubmissionMessage] = useState('');

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    message: '',
  });

  // Handle input changes for text fields
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Define the API base URL for your Render backend.
  // This URL should point to your deployed backend service that handles email sending.
  const API_BASE_URL = 'https://main-webpage-l85m.onrender.com'; // Your Render backend URL

  // Handle form submission (sends email notifications to applicant and admin)
  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Attempting to submit form with data:', formData);
    setSubmissionStatus('processing');
    setSubmissionMessage('Sending your application and confirmation email...');

    try {
      // 1. Send confirmation email to the applicant
      // This email confirms to the user that their application has been received.
      const applicantRes = await fetch(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'applicationConfirmation', // Backend email template type
          name: formData.name,
          email: formData.email,
          internshipTitle: internship?.title || 'Internship', // Pass internship title for email context
        }),
      });

      if (!applicantRes.ok) {
        const errorText = await applicantRes.text();
        console.warn('Failed to send confirmation email to applicant:', errorText);
        // Log a warning, but proceed to try sending admin email as it's independent.
      } else {
        console.log('Confirmation email sent to applicant successfully.');
      }

      // 2. Send application details notification email to the admin
      // This email contains the full application details for the administrator.
      const adminRes = await fetch(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'internshipApplicationNotification', // Backend email template type
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          education: formData.education,
          experience: formData.experience,
          message: formData.message,
          internshipTitle: internship?.title || 'Internship', // Pass internship title for email context
        }),
      });

      if (!adminRes.ok) {
        const errorText = await adminRes.text();
        throw new Error(`Failed to notify admin: ${adminRes.status} - ${errorText}`);
      }
      console.log('Application notification email sent to admin successfully.');
      setSubmissionStatus('success');
      setSubmissionMessage('Application submitted successfully! A confirmation email has been sent to you.');

      // Reset the form fields after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        education: '',
        experience: '',
        message: '',
      });
    } catch (error) {
      console.error('Error during application submission:', error);
      setSubmissionStatus('error');
      // Provide a user-friendly error message, handling different error types
      setSubmissionMessage(`Application submission failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your network connection or contact support.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center py-16 px-4 font-sans">
      {/* Page Title with animation */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12 drop-shadow-sm"
      >
        <span className="text-red-600">{internship.title}</span> Internship Application
      </motion.h1>

      <section className="section w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Internship Details Section */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Internship Overview</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">{internship.description}</p>

                {/* Key Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center">
                      <Calendar className="text-red-500 mr-3 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="font-semibold text-gray-700 text-lg">Duration</h3>
                        <p className="text-gray-600">{internship.duration}</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center">
                      {internship.mode === 'Online' ? (
                        <>
                          <Wifi className="text-red-500 mr-3 flex-shrink-0" size={24} />
                          <div>
                            <h3 className="font-semibold text-gray-700 text-lg">Mode</h3>
                            <p className="text-gray-600">Online / Remote</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Home className="text-red-500 mr-3 flex-shrink-0" size={24} />
                          <div>
                            <h3 className="font-semibold text-gray-700 text-lg">Mode</h3>
                            <p className="text-gray-600">Offline / On-site</p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center">
                      <Users className="text-red-500 mr-3 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="font-semibold text-gray-700 text-lg">Department</h3>
                        <p className="text-gray-600">{internship.department}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Responsibilities */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Responsibilities</h3>
                  <ul className="space-y-3">
                    {internship.responsibilities.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                      <li key={index} className="flex items-start text-gray-700 text-base">
                        <Check className="text-red-500 mr-2 mt-1 flex-shrink-0" size={20} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Requirements</h3>
                  <ul className="space-y-3">
                    {internship.requirements.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                      <li key={index} className="flex items-start text-gray-700 text-base">
                        <Check className="text-red-500 mr-2 mt-1 flex-shrink-0" size={20} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Benefits</h3>
                  <ul className="space-y-3">
                    {internship.benefits.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                      <li key={index} className="flex items-start text-gray-700 text-base">
                        <Check className="text-red-500 mr-2 mt-1 flex-shrink-0" size={20} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>

          {/* Application Form Section */}
          <div className="lg:col-span-1">
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-xl p-8 border border-gray-100 sticky top-24 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {submissionStatus === 'idle' || submissionStatus === 'processing' ? (
                  <>
                    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Apply Now</h3>
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      {/* Form Fields with subtle animations */}
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={inputFieldClasses}
                          placeholder="Enter your full name"
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={inputFieldClasses}
                          placeholder="your.email@example.com"
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
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
                          placeholder="+1 (123) 456-7890"
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                          Highest Degree and Branch <span className="text-red-500">*</span>
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
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                          Relevant Experience
                        </label>
                        <textarea
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          rows={4}
                          className={`${inputFieldClasses} resize-none`}
                          placeholder="Briefly describe your relevant experience, projects, or internships..."
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.45 }}>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Cover Letter (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className={`${inputFieldClasses} resize-none`}
                          placeholder="Tell us why you're interested in this internship and what makes you a great fit..."
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                        <Button
                          type="submit"
                          variant="primary"
                          fullWidth
                          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg mt-6"
                          disabled={submissionStatus === 'processing'}
                        >
                          {submissionStatus === 'processing' ? (
                            <>
                              <Loader2 className="mr-2 animate-spin" size={20} />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2" size={20} />
                              Submit Application
                            </>
                          )}
                        </Button>
                      </motion.div>
                      {submissionStatus === 'processing' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 text-center text-red-600 flex items-center justify-center font-medium"
                        >
                          <Loader2 className="mr-2 animate-spin" size={20} /> {submissionMessage}
                        </motion.div>
                      )}
                    </form>
                  </>
                ) : (
                  // Submission Status Message (Success/Error)
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center py-8 px-4"
                  >
                    <div className={`p-6 rounded-lg mb-6 ${submissionStatus === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                      {submissionStatus === 'success' ? (
                        <>
                          <CheckCircle className="inline-block mb-3 text-green-600" size={32} />
                          <p className="text-xl font-semibold mb-2">Application Submitted Successfully!</p>
                          <p className="text-base mt-2">
                            Thank you for applying. A confirmation email has been sent to <span className="font-bold">{formData.email}</span>. Our team will review your application and contact you soon.
                          </p>
                        </>
                      ) : (
                        <>
                          <XCircle className="inline-block mb-3 text-red-600" size={32} />
                          <p className="text-xl font-semibold mb-2">Application Submission Failed!</p>
                          <p className="text-base mt-2">
                            {submissionMessage || "There was an unexpected issue submitting your application. Please try again later or contact support."}
                          </p>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmissionStatus('idle');
                        setSubmissionMessage('');
                      }}
                      className="mt-4"
                    >
                      Submit Another Application
                    </Button>
                  </motion.div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternshipDetails;
