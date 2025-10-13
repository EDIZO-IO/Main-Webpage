// src/pages/UpcomingWebinars.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, MapPin, UserCheck } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import { useWebinars } from '../components/hooks/useWebinars';

const UpcomingWebinars: React.FC = () => {
  const { webinars, loading, error } = useWebinars();

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    } catch (e) {
      console.warn(`Could not format date: ${dateString}`, e);
      return 'Date TBD';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const getStatusColors = (status: string) => {
    // Case-insensitive comparison
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'confirmed':
        return {
          gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
          ring: 'ring-green-200',
          text: 'text-green-600',
          bg: 'bg-green-50'
        };
      case 'waiting':
        return {
          gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
          ring: 'ring-blue-200',
          text: 'text-blue-600',
          bg: 'bg-blue-50'
        };
      case 'coming soon':
        return {
          gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
          ring: 'ring-purple-200',
          text: 'text-purple-600',
          bg: 'bg-purple-50'
        };
      default:
        return {
          gradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
          ring: 'ring-gray-200',
          text: 'text-gray-600',
          bg: 'bg-gray-50'
        };
    }
  };

  // Helper function to check if event is confirmed (case-insensitive)
  const isConfirmed = (status: string): boolean => {
    return status.toLowerCase() === 'confirmed';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <PageHeader
        title="Upcoming Webinars"
        subtitle="Join our free sessions led by industry experts."
        variant="default"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
              <p className="text-gray-600 text-lg">Loading upcoming webinars...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <AnimatedSection>
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-red-100 p-8">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Webinars</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Please check your Google Sheets API configuration and permissions.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            </AnimatedSection>
          )}

          {/* No Webinars */}
          {!loading && !error && webinars.length === 0 && (
            <AnimatedSection>
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Events Currently Available</h2>
                <p className="text-gray-600">
                  We don't have any confirmed, waiting, or coming soon webinars scheduled right now. Please check back later!
                </p>
              </div>
            </AnimatedSection>
          )}

          {/* Webinar Grid */}
          {!loading && !error && webinars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {webinars.map((event, index) => {
                const colors = getStatusColors(event.status);
                const showFullDetails = isConfirmed(event.status);
                
                return (
                  <AnimatedSection key={event.id} delay={index * 0.1}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      custom={index}
                      whileHover={{ 
                        y: -8, 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                      }}
                      className={`bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full ring-2 ${colors.ring}`}
                    >
                      {/* Status Banner */}
                      <div className={`px-6 py-3 text-center text-sm font-semibold text-white ${colors.gradient}`}>
                        {event.status}
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        {/* Event Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Conditional Rendering based on Status */}
                        {showFullDetails ? (
                          <>
                            {/* Event Details for Confirmed */}
                            <div className="space-y-3 mb-4 flex-grow">
                              {event.date && (
                                <div className="flex items-start text-gray-600">
                                  <Calendar className="flex-shrink-0 mr-2 mt-0.5 text-red-500" size={18} />
                                  <span className="text-sm">
                                    <time dateTime={event.date}>{formatDate(event.date)}</time>
                                  </span>
                                </div>
                              )}
                              <div className="flex items-start text-gray-600">
                                <MapPin className="flex-shrink-0 mr-2 mt-0.5 text-red-500" size={18} />
                                <span className="text-sm">{event.location}</span>
                              </div>
                              {event.description && (
                                <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            {/* Registration Link for Confirmed */}
                            {event.registrationLink && event.registrationLink.trim() !== '' ? (
                              <motion.a
                                href={event.registrationLink.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto w-full inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg shadow hover:from-red-700 hover:to-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <UserCheck className="mr-2" size={18} />
                                Register Now
                              </motion.a>
                            ) : (
                              <div className="mt-auto w-full text-center py-3 px-5 bg-gray-100 text-gray-500 font-semibold rounded-lg text-sm">
                                Registration Link Coming Soon
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Minimal info for 'Waiting' or 'Coming Soon' */}
                            <div className="flex-grow flex items-center justify-center py-8">
                              <p className="text-gray-500 text-sm text-center">
                                {event.status.toLowerCase() === 'waiting' 
                                  ? 'Date and details will be confirmed soon'
                                  : 'Event details coming soon'}
                              </p>
                            </div>
                            <div 
                              className={`mt-auto w-full text-center py-3 px-5 rounded-lg text-sm font-semibold ${colors.text} ${colors.bg}`}
                            >
                              Stay Tuned
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UpcomingWebinars;
