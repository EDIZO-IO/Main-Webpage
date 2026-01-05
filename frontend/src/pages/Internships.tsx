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
} from "lucide-react";
import { useInternships } from "../components/hooks/useInternships";
import { getHighestDiscount, hasDiscount } from "../utils/internship.utils";
import Button from '../components/common/Button'; // Update path as needed
import { useStats } from '../components/hooks/useStats';

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

// === Memoized PageHeader with Modern Glass Design ===
interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  showVerifyButton?: boolean;
}
const PageHeader = memo<PageHeaderProps>(({ title, subtitle, showVerifyButton }) => {
  const { stats: statsData } = useStats();

  return (
    <section
      className="relative text-white min-h-[420px] md:min-h-[480px] lg:min-h-[520px] flex items-center justify-center overflow-hidden py-16"
      aria-labelledby="internships-hero-title"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Enhanced Dark overlay with gradient */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(15, 23, 42, 0.9) 100%)'
      }} />

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 z-[2] opacity-60">
        <motion.div
          className="absolute w-[600px] h-[600px] -top-48 -left-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] top-1/2 -right-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 60%)' }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] -bottom-32 left-1/3 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* Floating Glass Skill Icons - Left */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-[5]">
        {[
          { Icon: Code, color: 'from-green-400 to-emerald-600' },
          { Icon: Palette, color: 'from-pink-400 to-rose-600' },
          { Icon: Bot, color: 'from-cyan-400 to-blue-600' },
          { Icon: Video, color: 'from-orange-400 to-red-600' },
        ].map((item, i) => (
          <motion.div
            key={`left-${i}`}
            className="p-3 rounded-xl backdrop-blur-xl border border-white/20 shadow-xl"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: 0.5 + i * 0.1, duration: 0.5 },
              x: { delay: 0.5 + i * 0.1, duration: 0.5 },
              y: { repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3 }
            }}
            whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
              <item.Icon size={20} className="text-white" strokeWidth={2} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Glass Skill Icons - Right */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-[5]">
        {[
          { Icon: Server, color: 'from-purple-400 to-violet-600' },
          { Icon: PenTool, color: 'from-fuchsia-400 to-pink-600' },
          { Icon: Film, color: 'from-amber-400 to-orange-600' },
          { Icon: Globe, color: 'from-teal-400 to-emerald-600' },
        ].map((item, i) => (
          <motion.div
            key={`right-${i}`}
            className="p-3 rounded-xl backdrop-blur-xl border border-white/20 shadow-xl"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 0.5 + i * 0.1, duration: 0.5 },
              x: { delay: 0.5 + i * 0.1, duration: 0.5 },
              y: { repeat: Infinity, duration: 3.5 + i * 0.4, delay: i * 0.25 }
            }}
            whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
              <item.Icon size={20} className="text-white" strokeWidth={2} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content with Glass Card */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glass Container */}
          <div
            className="text-center p-8 md:p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Inner glow effects */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-500/20 to-transparent rounded-tr-full" />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.div>
              <span className="text-white/90 text-sm font-semibold">Start Your Career Journey</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              id="internships-hero-title"
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-white">
                {title}
              </span>
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-lg md:text-xl font-medium max-w-2xl mx-auto text-white/70 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Verify Certificate Button */}
            {showVerifyButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link
                  to="/verify-certificate"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all group shadow-xl hover:shadow-2xl hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9) 0%, rgba(239, 68, 68, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Award className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                  <span>Verify Your Certificate</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}

            {/* Stats Row */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8 pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { value: statsData.students_trained?.value || '500+', label: 'Students Trained' },
                { value: statsData.programs_count?.value || '15+', label: 'Programs' },
                { value: statsData.certification_rate?.value || '100%', label: 'Certification' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-700">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/10 via-white/10 to-transparent z-[4]" />
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
            className="w-40 h-40 object-cover transition-transform duration-700 group-hover:scale-105"
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
        // @ts-ignore
        showVerifyButton={true}
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
