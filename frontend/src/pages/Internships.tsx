// src/pages/Internships.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wifi, ArrowRight, Star, Search, TrendingUp, Users, Zap, Award } from 'lucide-react';

// === Define TypeScript interfaces ===
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

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
}

// === Simplified PageHeader Component ===
interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section
      className="relative text-white pt-20 pb-12 md:pt-24 md:pb-16"
      aria-labelledby="internships-hero-title"
    >
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="internshipsHeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L1440,0 C1440,400 1080,600 720,600 C360,600 0,400 0,800 L0,0 Z"
            fill="url(#internshipsHeroGradient)"
          />
          <path
            d="M0,200 C360,400 1080,400 1440,200 L1440,800 C1080,600 360,600 0,800 Z"
            fill="url(#internshipsHeroGradient)"
            opacity="0.3"
          />
        </svg>
      </div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        style={{ y: backgroundY }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            id="internships-hero-title"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="text-base md:text-lg font-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
};

// === Animated Section Component ===
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// === Why Choose Us Section ===
const WhyChooseUs = () => (
  <section className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Internships?</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Structured learning with real-world projects and expert mentorship.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Expert Mentorship", description: "Learn from professionals.", icon: <Users className="w-6 h-6 text-red-500" /> },
          { title: "Hands-On Projects", description: "Build your portfolio.", icon: <Zap className="w-6 h-6 text-red-500" /> },
          { title: "Flexible Scheduling", description: "Learn at your pace.", icon: <Wifi className="w-6 h-6 text-red-500" /> },
          { title: "Job Readiness", description: "Gain in-demand skills.", icon: <Award className="w-6 h-6 text-red-500" /> }
        ].map((item, index) => (
          <AnimatedSection key={item.title} delay={index * 0.05}>
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100 hover:border-red-200 transition-all duration-300"
            >
              <div className="flex justify-center mb-2">{item.icon}</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-xs">{item.description}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

// === Main Component ===
const Internships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch data from Google Sheets with improved error handling
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
        const SHEET_NAME = import.meta.env.VITE_INTERNSHIPS_SHEET_NAME || 'Internships';
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

        // Debug logging
        console.log('Fetching from Google Sheets...');
        console.log('Sheet ID:', SHEET_ID);
        console.log('Sheet Name:', SHEET_NAME);
        console.log('API Key:', API_KEY ? 'Present' : 'Missing');

        if (!SHEET_ID || !API_KEY) {
          throw new Error('Missing Google Sheets configuration. Check your .env file.');
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        console.log('Fetching URL:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error?.message || 'Failed to fetch data from Google Sheets');
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (!data.values || data.values.length <= 1) {
          console.warn('No data found in sheet');
          throw new Error('No internship data found in the sheet. Please add data to the "Internships" tab.');
        }

        // Skip header row (index 0), map the rest
        const parsedInternships: Internship[] = data.values.slice(1).map((row: any[], index: number) => {
          console.log(`Parsing row ${index + 1}:`, row);
          
          return {
            id: row[0] || `internship-${index}`,
            title: row[1] || 'Untitled',
            category: row[2] || 'General',
            mode: (row[3] || 'Online') as 'Online' | 'Offline',
            company: row[4] || 'EDIZO',
            image: row[5] || '/placeholder-image.png',
            rating: parseFloat(row[6]) || 4.0,
            description: row[7] || 'No description available.',
            isTrending: parseFloat(row[6]) >= 4.5,
          };
        });

        console.log('Parsed internships:', parsedInternships);
        setInternships(parsedInternships);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching internships:', err);
        setError(err.message || 'Failed to load internships. Please try again later.');
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Add JSON-LD schema
  useEffect(() => {
    if (internships.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Edizo Internship Programs',
      description: 'Internship programs in Design, Development, AI/ML, and more.',
      url: 'https://www.edizo.in/internships',
      numberOfItems: internships.length,
      itemListElement: internships.map((internship, index) => ({
        '@type': 'Course',
        position: index + 1,
        name: internship.title,
        description: internship.description,
        provider: { '@type': 'Organization', name: 'Edizo', url: 'https://www.edizo.in' },
        image: internship.image,
        url: `https://www.edizo.in/internships/${internship.id}`,
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'internships-schema';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('internships-schema');
      if (existing) document.head.removeChild(existing);
    };
  }, [internships]);

  // Filter logic
  const categories = ['All', ...new Set(internships.map((i) => i.category))];
  const trendingInternships = internships.filter((i) => i.isTrending);
  const filteredInternships = internships.filter((i) => {
    const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading internships...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center px-4 max-w-lg">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-gray-800 text-xl font-semibold mb-2">Unable to Load Internships</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
          <div className="mt-6 text-left bg-gray-100 p-4 rounded-lg text-xs">
            <p className="font-semibold mb-2">Troubleshooting:</p>
            <ul className="space-y-1 text-gray-700">
              <li>✓ Check if Google Sheet is publicly accessible</li>
              <li>✓ Verify the sheet has an "Internships" tab</li>
              <li>✓ Ensure data exists in the sheet</li>
              <li>✓ Check browser console for detailed errors</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <PageHeader
        title="Our Internships"
        subtitle="Kickstart your career with hands-on experience."
      />

      <WhyChooseUs />

      {/* Trending Internships */}
      <section className="py-10 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <TrendingUp className="text-red-500 w-6 h-6" /> Trending Internships
              </h2>
              <p className="text-gray-600 mt-2 text-sm max-w-xl mx-auto">
                Our most popular programs, highly rated by students.
              </p>
            </div>
          </AnimatedSection>

          {trendingInternships.length > 0 ? (
            <div className="flex overflow-x-auto space-x-3 pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4 md:overflow-visible">
              {trendingInternships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -3 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group flex-shrink-0 w-56 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all snap-center"
                >
                  <Link to={`/internships/${internship.id}`}>
                    <div className="relative h-28 overflow-hidden rounded-t-lg">
                      <img
                        src={internship.image}
                        alt={internship.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        🔥 Trending
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 group-hover:text-red-600 transition-colors">
                        {internship.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600 text-xs">{internship.category}</span>
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-current w-3 h-3 mr-1" />
                          <span className="text-xs font-medium bg-red-600 text-white rounded-full px-1.5 py-0.5">
                            {internship.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No trending internships available at the moment.</p>
          )}
        </div>
      </section>

      {/* All Internships */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Explore All Programs</h2>
              <div className="max-w-md mx-auto relative mb-4">
                <input
                  type="text"
                  placeholder="Search internships..."
                  className="w-full p-2.5 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search internships"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredInternships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3, borderColor: '#DC2626' }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
                >
                  <Link to={`/internships/${internship.id}`}>
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={internship.image}
                        alt={internship.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {internship.category}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1.5 line-clamp-2 h-10 group-hover:text-red-600 transition-colors">
                        {internship.title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{internship.description}</p>
                      <div className="flex items-center justify-between text-xs border-t pt-2">
                        <div className="flex items-center text-gray-500">
                          <Wifi className="mr-1 text-red-600" size={12} />
                          <span>{internship.mode}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-current w-3 h-3 mr-1" />
                          <span className="font-medium">{internship.rating}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <span className="text-red-600 text-xs font-semibold flex items-center hover:underline group-hover:gap-1 transition-all">
                          Apply Now <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No internships match your search criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Internships;
