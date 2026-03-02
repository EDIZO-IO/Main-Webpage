// src/pages/Services.jsx
import { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Globe, Palette, Smartphone, Video, Zap, Shield, BarChart2,
  Search, Users, RefreshCw, Server, TrendingUp, Target, Share2, Filter, X, CheckCircle,
  Mail, MessageCircle, Package, Loader2, AlertCircle, Code
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import Button from '../components/common/Button.jsx';
import { useServices } from '../hooks/useServices';

// Icon mapping for categories
const categoryIcons = {
  Development: Globe,
  Design: Palette,
  Marketing: Share2,
  SEO: TrendingUp,
  Consulting: Users,
  default: Code
};

// Color mapping for categories
const categoryColors = {
  Development: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-blue-600' },
  Design: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-500 to-purple-600' },
  Marketing: { bg: 'bg-orange-100', text: 'text-orange-700', gradient: 'from-orange-500 to-orange-600' },
  SEO: { bg: 'bg-green-100', text: 'text-green-700', gradient: 'from-green-500 to-green-600' },
  Consulting: { bg: 'bg-teal-100', text: 'text-teal-700', gradient: 'from-teal-500 to-teal-600' },
  default: { bg: 'bg-gray-100', text: 'text-gray-700', gradient: 'from-gray-500 to-gray-600' }
};

// === Service Card Component ===
const ServiceCard = memo(({ service, index, onApply }) => {
  const IconComponent = categoryIcons[service.category] || categoryIcons.default;
  const colors = categoryColors[service.category] || categoryColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Color-coded header instead of image */}
      <div className={`h-4 bg-gradient-to-r ${colors.gradient}`}></div>

      {/* Content */}
      <div className="p-6">
        {/* Category and Featured Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
            {service.category}
          </span>
          {service.is_featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Featured
            </span>
          )}
        </div>

        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} text-white shadow-lg`}>
            <IconComponent size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
        </div>

        {/* Subtitle */}
        {service.subtitle && (
          <p className="text-sm text-orange-600 font-medium mb-3">
            {service.subtitle}
          </p>
        )}

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{service.short_description}</p>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h4>
            <div className="flex flex-wrap gap-2">
              {service.features.slice(0, 4).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200"
                >
                  {feature}
                </span>
              ))}
              {service.features.length > 4 && (
                <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium">
                  +{service.features.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Technologies */}
        {service.tags && service.tags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {service.tags.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={() => onApply(service)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
        >
          {service.cta_text || 'Learn More'}
          <ArrowRight className="inline-block ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
});
ServiceCard.displayName = 'ServiceCard';

// === Category Button ===
const CategoryButton = memo(({ category, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
      isSelected
        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
    }`}
  >
    {category}
  </button>
));
CategoryButton.displayName = 'CategoryButton';

// === Why Choose Item ===
const WhyChooseItem = memo(({ title, description, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay }}
    className="p-5 rounded-xl border border-gray-200 bg-white text-center hover:shadow-lg transition-all"
  >
    <div className="flex justify-center mb-3">
      <div className="p-3 bg-orange-100 rounded-lg">
        {icon}
      </div>
    </div>
    <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
));
WhyChooseItem.displayName = 'WhyChooseItem';

// === Why Choose Us Section ===
const WhyChooseUs = memo(() => {
  const items = [
    { title: "Expert Team", description: "Skilled professionals with deep industry knowledge.", icon: <Users className="w-8 h-8 text-orange-600" /> },
    { title: "Innovation", description: "Cutting-edge solutions tailored to your needs.", icon: <Zap className="w-8 h-8 text-orange-600" /> },
    { title: "Quality Focus", description: "Rigorous testing and quality assurance.", icon: <Shield className="w-8 h-8 text-orange-600" /> },
    { title: "Client Partnership", description: "We work closely as a trusted partner.", icon: <TrendingUp className="w-8 h-8 text-orange-600" /> }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Why Choose <span className="text-orange-600">Edizo?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine technical expertise with creative vision to deliver exceptional results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <WhyChooseItem key={item.title} {...item} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
});
WhyChooseUs.displayName = 'WhyChooseUs';

// === Main Component ===
const Services = () => {
  const { services, loading, error } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories from database
  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, [services]);

  // Filter services
  const filteredServices = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return services.filter(service => {
      const matchesSearch =
        searchTerm === '' ||
        service.title.toLowerCase().includes(lowerSearch) ||
        service.subtitle?.toLowerCase().includes(lowerSearch) ||
        service.short_description?.toLowerCase().includes(lowerSearch) ||
        service.features?.some(f => f.toLowerCase().includes(lowerSearch)) ||
        service.tags?.some(t => t.toLowerCase().includes(lowerSearch));

      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (searchTerm !== '') count++;
    return count;
  }, [selectedCategory, searchTerm]);

  // Callbacks
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
  }, []);

  const handleApply = useCallback((service) => {
    window.location.href = `/services/${service.slug || service.id}`;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Services</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive digital solutions tailored to your business needs"
        badge="EDIZO • Digital Services"
        showServiceIcons={true}
      />

      <WhyChooseUs />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive suite of digital solutions to help your business grow and succeed.
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative w-full lg:flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services, features, or technologies..."
                  className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Filter size={18} />
                  <span>Filter:</span>
                </div>
                <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-4"
              >
                <span className="text-sm text-orange-800 font-medium">
                  {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1"
                >
                  <X size={16} />
                  Clear all
                </button>
              </motion.div>
            )}
          </div>

          {/* Services Grid */}
          <AnimatePresence mode="wait">
            {filteredServices.length > 0 ? (
              <motion.div
                key="services-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredServices.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} onApply={handleApply} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-gray-200"
              >
                <Search className="text-gray-300 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any services matching your criteria. Try adjusting your filters.
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multiple Service Application Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-xl">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Need Multiple Services?</h3>
                  <p className="text-white/90">
                    Select multiple services and get a combined quote with special package pricing!
                  </p>
                </div>
              </div>
              <Button
                to="/services/apply-multiple"
                variant="secondary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold whitespace-nowrap"
              >
                Save with Packages
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
              Join 100+ satisfied clients who transformed their business with our services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/917092435729?text=${encodeURIComponent('Hi Edizo Team! I am interested in your services. Please share more details.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:shadow-2xl transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Start Free Consultation</span>
              </a>
              <a
                href="mailto:edizoofficial@gmail.com?subject=Service Inquiry"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                <Mail className="w-6 h-6" />
                <span>Get Quote</span>
              </a>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/90">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} />
                Free Consultation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} />
                No Obligation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} />
                Expert Advice
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
