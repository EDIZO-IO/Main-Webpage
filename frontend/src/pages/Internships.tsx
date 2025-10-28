import { useState, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Wifi,
  ArrowRight,
  Star,
  Search,
  TrendingUp,
  Users,
  Zap,
  Award,
  Tag,
  Percent,
  Loader2,
  AlertCircle,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { useInternships } from "../components/hooks/useInternships";
import { getHighestDiscount, hasDiscount } from "../utils/internship.utils";

// === Interfaces ===
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}
interface InternshipDiscount {
  "15-days": number;
  "1-month": number;
  "2-months": number;
  "3-months": number;
}
interface Internship {
  id: string;
  title: string;
  category: string;
  mode: "Online" | "Offline";
  company: string;
  image: string;
  rating: number;
  description: string;
  isTrending?: boolean;
  discount?: InternshipDiscount;
}

// === Skeleton Loader ===
const InternshipCardSkeleton = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 14, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.32 }}
    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse"
  >
    <div className="h-32 bg-gray-200" />
    <div className="p-3 flex-grow flex flex-col">
      <div className="h-5 bg-gray-200 rounded mb-3 w-3/4" />
      <div className="h-3 bg-gray-200 rounded mb-2 w-2/3" />
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-12" />
      </div>
    </div>
  </motion.div>
));
InternshipCardSkeleton.displayName = "InternshipCardSkeleton";

// === Memoized PageHeader ===
interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
}
const PageHeader = memo<PageHeaderProps>(({ title, subtitle }) => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  return (
    <section
      className="relative text-white pt-20 pb-12 md:pt-24 md:pb-16"
      aria-labelledby="internships-hero-title"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="internshipsHeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#FF6B6B", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
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
      {/* Animated BG elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${15 + i * 30}%`,
              top: `${20 + i * 25}%`,
            }}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        style={{ y: backgroundY }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-white/90 text-sm font-semibold">Start Your Career Journey</span>
          </motion.div>
          <motion.h1
            id="internships-hero-title"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="text-base md:text-lg font-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
});
PageHeader.displayName = "PageHeader";

// === Memoized Animated Section ===
const AnimatedSection = memo<AnimatedSectionProps>(({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
));
AnimatedSection.displayName = "AnimatedSection";

// === Memoized Why Choose Item ===
const WhyChooseItem = memo<{ title: string; description: string; icon: React.ReactNode; delay: number }>(
  ({ title, description, icon, delay }) => (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-5 rounded-xl text-center border border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-center mb-3">{icon}</div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-xs">{description}</p>
      </motion.div>
    </AnimatedSection>
  )
);
WhyChooseItem.displayName = "WhyChooseItem";

// === Memoized Why Choose Us Section ===
const WhyChooseUs = memo(() => {
  const items = useMemo(
    () => [
      { title: "Expert Mentorship", description: "Learn from professionals.", icon: <Users className="w-7 h-7 text-red-500" /> },
      { title: "Hands-On Projects", description: "Build your portfolio.", icon: <Zap className="w-7 h-7 text-red-500" /> },
      { title: "Flexible Scheduling", description: "Learn at your pace.", icon: <Wifi className="w-7 h-7 text-red-500" /> },
      { title: "Job Readiness", description: "Gain in-demand skills.", icon: <Award className="w-7 h-7 text-red-500" /> },
    ],
    []
  );
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Internships?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Structured learning with real-world projects and expert mentorship.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <WhyChooseItem key={item.title} {...item} delay={index * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
});
WhyChooseUs.displayName = "WhyChooseUs";

// === Memoized Internship Card Component ===
interface InternshipCardProps {
  internship: Internship;
  index: number;
  showTrendingBadge?: boolean;
}
const InternshipCard = memo<InternshipCardProps>(({ internship, index, showTrendingBadge = false }) => {
  const maxDiscount = useMemo(() => getHighestDiscount(internship.discount), [internship.discount]);
  const hasDiscountBadge = useMemo(() => hasDiscount(internship.discount), [internship.discount]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02, duration: 0.25 }}
      className="group bg-white rounded-xl shadow-md border border-gray-100 hover:border-red-300 hover:shadow-xl transition-all overflow-hidden h-full flex flex-col"
    >
      <Link to={`/internships/${internship.id}`} className="h-full flex flex-col">
        <div className="relative h-40 overflow-hidden">
          <img
            src={internship.image}
            alt={internship.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">{internship.category}</div>
          {/* Trending Badge */}
          {showTrendingBadge && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg animate-pulse">🔥 Trending</span>
          )}
          {/* Discount Badge */}
          {!showTrendingBadge && hasDiscountBadge && maxDiscount > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
              <Percent size={12} />
              {maxDiscount}%
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[3rem]">{internship.title}</h3>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Wifi className="text-red-600" size={14} />
              <span className="font-medium">{internship.mode}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-current w-4 h-4" />
              <span className="font-bold text-gray-900">{internship.rating}</span>
            </div>
          </div>
          {hasDiscountBadge && maxDiscount > 0 && (
            <div className="mb-3 bg-green-50 px-3 py-1.5 rounded-lg">
              <span className="text-green-700 text-xs font-bold flex items-center gap-1">
                <Tag size={12} />
                Save up to {maxDiscount}%
              </span>
            </div>
          )}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <span className="text-red-600 text-sm font-bold flex items-center justify-between group-hover:gap-2 transition-all">
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
InternshipCard.displayName = "InternshipCard";

// === Trending Section ===
interface TrendingSectionProps { internships: Internship[]; }
const TrendingSection = memo<TrendingSectionProps>(({ internships }) => {
  if (internships.length === 0) return null;
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full mb-4">
              <TrendingUp className="text-red-600" size={20} />
              <span className="text-sm font-semibold text-red-700">Hot Right Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Trending Internships
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join thousands of students in our most popular programs
            </p>
          </div>
        </AnimatedSection>
        <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:overflow-visible">
          {internships.map((internship, index) => (
            <div key={internship.id} className="flex-shrink-0 w-64 snap-center md:w-auto">
              <InternshipCard internship={internship} index={index} showTrendingBadge />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
TrendingSection.displayName = "TrendingSection";

// === Memoized Category Button ===
const CategoryButton = memo<{ category: string; isSelected: boolean; onClick: () => void }>(
  ({ category, isSelected, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
        isSelected
          ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {category}
    </motion.button>
  )
);
CategoryButton.displayName = "CategoryButton";

// === Main Component ===
const Internships: React.FC = () => {
  const { internships, loading, error } = useInternships();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = useMemo(() => ["All", ...new Set(internships.map((i) => i.category))], [internships]);
  const trendingInternships = useMemo(() => internships.filter((i) => i.rating >= 4.5).slice(0, 8), [internships]);
  const filteredInternships = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return internships.filter((i) => {
      const matchesCategory = selectedCategory === "All" || i.category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        i.title.toLowerCase().includes(lowerSearch) ||
        i.description.toLowerCase().includes(lowerSearch) ||
        i.category.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesSearch;
    });
  }, [internships, selectedCategory, searchTerm]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (searchTerm !== "") count++;
    return count;
  }, [selectedCategory, searchTerm]);
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value), []);
  const handleCategoryChange = useCallback((category: string) => setSelectedCategory(category), []);
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("All");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col">
        <PageHeader
          title="Our Internships"
          subtitle="Loading amazing opportunities for you..."
        />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <InternshipCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-gray-100"
        >
          <AlertCircle className="text-red-600 mx-auto mb-6" size={72} />
          <h2 className="text-gray-900 text-3xl font-bold mb-3">
            Unable to Load Internships
          </h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:from-red-700 hover:to-orange-600 transition-colors font-bold shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <PageHeader
        title="Our Internships"
        subtitle="Kickstart your career with hands-on experience and expert mentorship."
      />
      <WhyChooseUs />
      <TrendingSection internships={trendingInternships} />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Explore All Programs
              </h2>
              <p className="text-gray-600 text-lg mb-2">
                {filteredInternships.length}{" "}
                {filteredInternships.length === 1 ? "Program" : "Programs"} Available
              </p>
              <div className="max-w-xl mx-auto relative mb-8">
                <input
                  type="text"
                  placeholder="Search by title, category, or description..."
                  className="w-full p-4 pl-12 pr-24 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm text-gray-900 font-medium"
                  value={searchTerm}
                  onChange={handleSearch}
                  aria-label="Search internships"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Filter size={18} />
                  <span>Filter:</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <CategoryButton
                      key={category}
                      category={category}
                      isSelected={selectedCategory === category}
                      onClick={() => handleCategoryChange(category)}
                    />
                  ))}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3"
                >
                  <span className="text-sm text-gray-600">
                    {activeFilterCount}{" "}
                    {activeFilterCount === 1 ? "filter" : "filters"} active
                  </span>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <X size={14} />
                    Clear all
                  </button>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredInternships.map((internship, index) => (
                <InternshipCard key={internship.id} internship={internship} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200"
            >
              <Search className="text-gray-300 mx-auto mb-6" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Internships Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any programs matching your search.
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:from-red-700 hover:to-orange-600 transition-colors font-bold shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Internships;
