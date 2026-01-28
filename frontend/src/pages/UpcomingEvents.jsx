import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, Clock, Info, AlertCircle, Calendar, Users, TrendingUp, 
  Award, Globe, Zap, Star, ExternalLink, MapPin, Mail, Phone 
} from 'lucide-react';
import { useWebinars } from '../components/hooks/useWebinars';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';

// Status icons mapping
const statusIcons = {
  Confirmed: <UserCheck className="text-green-500" size={20} />,
  Waiting: <Clock className="text-yellow-500" size={20} />,
  'Coming Soon': <Info className="text-red-500" size={20} />,
  'Not Fixed': <AlertCircle className="text-gray-400" size={20} />,
};

const UpcomingWebinars = () => {
  const { webinars, loading, error } = useWebinars();

  const cardVariants = {
    hidden: (i) => ({
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Coming Soon':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Not Fixed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <PageHeader
        title="Upcoming Events"
        subtitle="Join our upcoming webinars, workshops, and networking events"
        badge="EDIZO • Events & Webinars"
        showServiceIcons={true}
      >
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            to="/contact"
            variant="primary"
            size="md"
            iconRight={<ExternalLink className="w-5 h-5" />}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            Register Now
          </Button>
          <Button
            to="/services"
            variant="outline"
            size="md"
            className="border-gray-300 text-gray-800"
          >
            View Services
          </Button>
        </div>
      </PageHeader>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Upcoming Events</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest webinars, workshops, and industry events
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Events</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : webinars.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center max-w-lg mx-auto">
              <Info className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-blue-800 mb-2">No Upcoming Events</h3>
              <p className="text-blue-600">Check back later for our upcoming events and webinars</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {webinars.map((webinar, index) => (
                <motion.div
                  key={webinar.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{webinar.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(webinar.status)}`}>
                        {webinar.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{webinar.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-3 text-orange-500" />
                        <span className="text-sm">{formatDate(webinar.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                        <span className="text-sm">{webinar.location || 'Online Event'}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Users className="w-5 h-5 mr-3 text-orange-500" />
                        <span className="text-sm">{webinar.attendees || 'Unlimited'} Attendees</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Organizer:</span>
                        <span className="text-sm font-medium text-gray-900">{webinar.organizer || 'EDIZO'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        to={webinar.registrationLink || '/contact'}
                        variant="primary"
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                      >
                        Register Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">Events Hosted</div>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">2000+</div>
              <div className="text-gray-600">Attendees</div>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">95%</div>
              <div className="text-gray-600">Satisfaction</div>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-red-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Know About Our <span className="text-orange-400">Upcoming Events?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about our webinars, workshops, and industry events
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Contact Us
            </Button>
            <Button
              to="/newsletter"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpcomingWebinars;