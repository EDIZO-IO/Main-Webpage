// src/pages/UpcomingWebinars.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, MapPin, UserCheck, AlertCircle, ExternalLink } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import { useWebinars } from '../components/hooks/useWebinars';
import { 
  formatWebinarDate, 
  WEBINAR_STATUS_COLORS,
  isValidWebinarStatus,
  type Webinar 
} from '../types/webinar';

const UpcomingWebinars: React.FC = () => {
  const { webinars, loading, error } = useWebinars();

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
    // Validate and normalize status
    const normalizedStatus = status.trim();
    
    if (!isValidWebinarStatus(normalizedStatus)) {
      console.warn(`Invalid webinar status: ${status}`);
      return {
        gradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
        ring: 'ring-gray-200',
        text: 'text-gray-600',
        bg: 'bg-gray-50'
      };
    }

    const baseColors = WEBINAR_STATUS_COLORS[normalizedStatus];
    
    // Map to gradient and ring styles
    const colorMap = {
      'Confirmed': {
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
        ring: 'ring-green-200',
      },
      'Waiting': {
        gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        ring: 'ring-yellow-200',
      },
      'Coming Soon': {
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
        ring: 'ring-blue-200',
      },
      'Not Fixed': {
        gradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
        ring: 'ring-gray-200',
      }
    };

    return {
      ...colorMap[normalizedStatus],
      text: baseColors.text,
      bg: baseColors.bg
    };
  };

  const isConfirmed = (status: string): boolean => {
    return status.trim() === 'Confirmed';
  };

  const hasValidRegistrationLink = (link?: string): boolean => {
    if (!link) return false;
    const trimmed = link.trim();
    return trimmed.length > 0 && (trimmed.startsWith('http://') || trimmed.startsWith('https://'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <PageHeader
        title="Upcoming Webinars"
        subtitle="Join our free sessions led by industry experts. Register now and elevate your skills!"
        variant="default"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
              <p className="text-gray-600 text-lg font-medium">Loading upcoming webinars...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <AnimatedSection>
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-2xl mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Webinars</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Troubleshooting:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Check if Google Sheet is publicly accessible</li>
                    <li>✓ Verify environment variables are set in Netlify</li>
                    <li>✓ Ensure "Webinars" tab exists in the sheet</li>
                    <li>✓ Check browser console for detailed errors</li>
                  </ul>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold shadow-md"
                >
                  Retry Loading
                </button>
              </div>
            </AnimatedSection>
          )}

          {/* No Webinars */}
          {!loading && !error && webinars.length === 0 && (
            <AnimatedSection>
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">No Webinars Scheduled</h2>
                <p className="text-gray-600 mb-2">
                  We don't have any confirmed webinars scheduled at the moment.
                </p>
                <p className="text-gray-500 text-sm">
                  Check back soon for exciting upcoming events!
                </p>
              </div>
            </AnimatedSection>
          )}

          {/* Webinar Grid */}
          {!loading && !error && webinars.length > 0 && (
            <>
              <div className="text-center mb-12">
                <p className="text-gray-600 text-lg">
                  Showing <span className="font-bold text-red-600">{webinars.length}</span> upcoming {webinars.length === 1 ? 'webinar' : 'webinars'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {webinars.map((event: Webinar, index: number) => {
                  const colors = getStatusColors(event.status);
                  const showFullDetails = isConfirmed(event.status);
                  const hasRegistration = hasValidRegistrationLink(event.registrationLink);
                  
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
                        <div className={`px-6 py-3 text-center text-sm font-bold text-white ${colors.gradient}`}>
                          {event.status}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          {/* Event Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem]">
                            {event.title}
                          </h3>

                          {/* Conditional Rendering based on Status */}
                          {showFullDetails ? (
                            <>
                              {/* Event Details for Confirmed */}
                              <div className="space-y-3 mb-6 flex-grow">
                                {event.date && (
                                  <div className="flex items-start text-gray-700">
                                    <Calendar className="flex-shrink-0 mr-3 mt-0.5 text-red-500" size={18} />
                                    <span className="text-sm font-medium">
                                      <time dateTime={event.date}>{formatWebinarDate(event.date)}</time>
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-start text-gray-700">
                                  <MapPin className="flex-shrink-0 mr-3 mt-0.5 text-red-500" size={18} />
                                  <span className="text-sm font-medium">{event.location}</span>
                                </div>
                                {event.description && (
                                  <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                      {event.description}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Registration Link for Confirmed */}
                              {hasRegistration ? (
                                <motion.a
                                  href={event.registrationLink!.trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-auto w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <UserCheck size={18} />
                                  Register Now
                                  <ExternalLink size={14} />
                                </motion.a>
                              ) : (
                                <div className="mt-auto w-full text-center py-3 px-5 bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold rounded-lg text-sm">
                                  Registration Opening Soon
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {/* Minimal info for 'Waiting' or 'Coming Soon' */}
                              <div className="flex-grow flex items-center justify-center py-12">
                                <div className="text-center">
                                  <div className="text-4xl mb-3">
                                    {event.status === 'Waiting' ? '⏳' : '🔜'}
                                  </div>
                                  <p className="text-gray-500 text-sm">
                                    {event.status === 'Waiting' 
                                      ? 'Date and details will be confirmed soon'
                                      : 'Event details coming soon'}
                                  </p>
                                  {event.description && (
                                    <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                                      {event.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div 
                                className={`mt-auto w-full text-center py-3 px-5 rounded-lg text-sm font-semibold border ${colors.text} ${colors.bg} border-gray-200`}
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default UpcomingWebinars;
