import { useState, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import {
  Wifi,
  ArrowRight,
  Star,
  Search,
  TrendingUp,
  Users,
  Zap,
  Award,
  Percent,
  AlertCircle,
  Sparkles,
  Filter,
  X,
  Code,
  Palette,
  Video,
  Bot,
  Server,
  PenTool,
  Film,
  Globe,
  Phone,
} from "lucide-react";
import { useInternships } from "../components/hooks/useInternships";
import { getHighestDiscount, hasDiscount } from "../utils/internshipUtils";
import Button from '../components/common/Button'; // Update path as needed
import { useStats } from '../components/hooks/useStats';
import PageHeader from '../components/common/PageHeader'; // Import the common PageHeader


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

// === Memoized Animated Section ===
const AnimatedSection = memo(({ children, delay = 0 }) => (
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
const WhyChooseItem = memo(
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
const InternshipCard = memo(({ internship, index, showTrendingBadge = false }) => {
  const maxDiscount = useMemo(() => getHighestDiscount(internship.discount), [internship.discount]);
  const hasDiscountBadge = useMemo(() => hasDiscount(internship.discount), [internship.discount]);

  return (
    <AnimatedSection delay={index * 0.04}>
      <motion.div
        whileHover={{ y: -7, scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="group relative bg-white border border-gray-200 shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-all"
        style={{
          borderRadius: "1.025rem", // classic rounded
        }}
      >
        {/* Flat geometric image section */}
        <div className="relative h-48 overflow-hidden bg-gray-50">
          <img
            src={internship.image}
            alt={internship.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
          {/* Category badge */}
          <span className="absolute top-5 left-5 px-3 py-1.5 text-xs font-bold rounded bg-blue-500 text-white shadow backdrop-blur">
            {internship.category}
          </span>
          {/* Trending or Discount Badge */}
          {showTrendingBadge ? (
            <span className="absolute top-5 right-5 px-2.5 py-1 text-xs rounded bg-orange-500 text-white font-bold shadow flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Trending
            </span>
          ) : (
            hasDiscountBadge && maxDiscount > 0 && (
              <span className="absolute top-5 right-5 px-2.5 py-1 text-xs rounded bg-green-500 text-white font-bold shadow flex items-center gap-1">
                <Percent size={12} />
                {maxDiscount}% OFF
              </span>
            )
          )}
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 py-2 px-5 bg-gradient-to-t from-white/10 to-white/10 border-t border-gray-300 flex flex-col">
            <span className="text-l font-bold text-orange-600">{internship.title}</span>
            <span className="text-xs text-gray-500 font-medium">{internship.mode}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2 text-[13px]">
            <span className="flex items-center gap-1 rounded px-2 py-0.5 bg-gray-100 text-orange-700 font-medium text-xs">
              <Star className="w-4 h-4 text-yellow-400" /> {internship.rating}/5
            </span>
            {hasDiscountBadge && maxDiscount > 0 && (
              <span className="flex items-center gap-1 bg-green-50 text-green-800 px-2 py-0.5 rounded text-xs font-bold border border-green-200">
                <Percent size={12} /> {maxDiscount}% Off
              </span>
            )}
          </div>
          <p className="text-gray-700 text-xs mb-3 line-clamp-2">{internship.description}</p>
          <Button
            to={`/internships/${internship.id}`}
            variant="primary"
            size="sm"
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-auto rounded-2xl border-none font-bold shadow-none"
          >
            Apply Now
          </Button>
        </div>
      </motion.div>
    </AnimatedSection>
  );
});
InternshipCard.displayName = "InternshipCard";

// === Trending Section ===
const TrendingSection = memo(({ internships }) => {
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
              <InternshipCard key={internship.id} internship={internship} index={index} showTrendingBadge />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
TrendingSection.displayName = "TrendingSection";

// === Memoized Category Button ===
const CategoryButton = memo(
  ({ category, isSelected, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${isSelected
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
const Internships = () => {
  const { internships, loading, error } = useInternships();
  const { stats: statsData } = useStats(); // Add stats hook
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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
  const handleSearch = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleCategoryChange = useCallback((category) => setSelectedCategory(category), []);
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
          badge="EDIZO • Career Opportunities"
          showServiceIcons={true}
          showStats={true}
          stats={[
            { value: statsData.students_trained?.value || '500+', label: 'Students Trained' },
            { value: statsData.programs_count?.value || '15+', label: 'Programs' },
            { value: statsData.certification_rate?.value || '100%', label: 'Certification Rate' },
          ]}
        >
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link
              to="/verify-certificate"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Award className="w-5 h-5" />
              <span>Verify Certificate</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <Phone className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>
          </div>
        </PageHeader>
        {/* Trending Section Loading */}
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
              {[...Array(4)].map((_, i) => (
                <div key={`trending-${i}`} className="flex-shrink-0 w-64 snap-center md:w-auto">
                  <InternshipCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Internships Loading */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Explore All Programs
                </h2>
                <p className="text-gray-600 text-lg mb-2">
                  Loading programs...
                </p>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <InternshipCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
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
        badge="EDIZO • Career Opportunities"
        showServiceIcons={true}
        showStats={true}
        stats={[
          { value: statsData.students_trained?.value || '500+', label: 'Students Trained' },
          { value: statsData.programs_count?.value || '15+', label: 'Programs' },
          { value: statsData.certification_rate?.value || '100%', label: 'Certification Rate' },
        ]}
      >
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            to="/verify-certificate"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Award className="w-5 h-5" />
            <span>Verify Certificate</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Contact Us</span>
          </Link>
        </div>
      </PageHeader>
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