import { useEffect, useState } from 'react';
import { Star, Quote, ThumbsUp, Calendar, User, Loader2, Filter, Search } from 'lucide-react';
import { testimonialsAPI } from '../api/api';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialsAPI.getAll();
        const approved = (response.data.testimonials || []).filter(t => t.is_approved);
        setTestimonials(approved);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 justify-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            fill={i < rating ? '#f97316' : 'none'}
            color={i < rating ? '#f97316' : '#d1d5db'}
          />
        ))}
      </div>
    );
  };

  const filteredTestimonials = testimonials.filter(t => {
    const matchesRating = filterRating === 'all' || t.rating === parseInt(filterRating);
    const matchesSearch = !searchTerm || 
      t.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const stats = {
    total: testimonials.length,
    average: testimonials.length > 0 
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : '0.0',
    fiveStars: testimonials.filter(t => t.rating === 5).length,
    fourStars: testimonials.filter(t => t.rating === 4).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <PageHeader
        title="Client Testimonials"
        subtitle="Real feedback from our valued clients"
        breadcrumb={[{ label: 'Home', path: '/' }, { label: 'Testimonials' }]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500 mb-2">
              {stats.total}
            </div>
            <div className="text-gray-600 font-medium">Total Reviews</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500 mb-2">
              {stats.average}
            </div>
            <div className="text-gray-600 font-medium">Average Rating</div>
            <div className="flex justify-center mt-2">{renderStars(Math.round(stats.average))}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.fiveStars}</div>
            <div className="text-gray-600 font-medium">5 Star Reviews</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.fourStars}</div>
            <div className="text-gray-600 font-medium">4 Star Reviews</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Testimonials Found</h3>
            <p className="text-gray-600">Be the first to leave a review!</p>
            <Button
              onClick={() => window.location.href = '/write-review'}
              className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Write a Review
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Rating */}
                <div className="mb-6">{renderStars(testimonial.rating)}</div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed italic line-clamp-4">
                  "{testimonial.content}"
                </p>

                {/* Service Type */}
                {testimonial.service_type && (
                  <div className="mb-6">
                    <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                      {testimonial.service_type}
                    </span>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    {testimonial.customer_name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{testimonial.customer_name}</div>
                    <div className="text-sm text-gray-600">Valued Client</div>
                  </div>
                </div>

                {/* Date */}
                {testimonial.created_at && (
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(testimonial.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}

                {/* Helpful Button */}
                <button className="flex items-center gap-2 mt-6 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  <ThumbsUp size={16} />
                  <span>Helpful</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white shadow-2xl shadow-orange-500/30">
            <h2 className="text-3xl font-bold mb-4">Had a Great Experience?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Share your feedback and help others discover our services
            </p>
            <Button
              onClick={() => window.location.href = '/write-review'}
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              Write a Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
