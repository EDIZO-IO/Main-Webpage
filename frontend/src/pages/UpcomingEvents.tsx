import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, UserCheck, AlertCircle, ExternalLink, Info, Clock, Sparkles } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import { useWebinars } from '../components/hooks/useWebinars';
import {
  formatWebinarDate,
  WEBINAR_STATUS_COLORS,
  isValidWebinarStatus,
  type Webinar
} from '../types/webinar';

const statusIcons: Record<string, React.ReactNode> = {
  Confirmed: <UserCheck className="text-green-500" size={20} />,
  Waiting: <Clock className="text-yellow-500" size={20} />,
  'Coming Soon': <Info className="text-red-500" size={20} />,
  'Not Fixed': <AlertCircle className="text-gray-400" size={20} />,
};

const UpcomingWebinars: React.FC = () => {
  const { webinars, loading, error } = useWebinars();

  const cardVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 24,
      scale: 0.97,
      transition: {
        delay: i * 0.08,
      },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.48,
        type: "spring" as const,
        stiffness: 70,
        damping: 15,
      },
    }),
  };

  const getStatusColors = (status: string) => {
    const normalizedStatus = status.trim();
    if (!isValidWebinarStatus(normalizedStatus)) {
      return {
        gradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
        ring: 'ring-gray-200',
        text: 'text-gray-600',
        bg: 'bg-gray-50'
      };
    }
    const baseColors = WEBINAR_STATUS_COLORS[normalizedStatus];
    const colorMap = {
      'Confirmed': { gradient: 'bg-gradient-to-r from-green-500 to-emerald-500', ring: 'ring-green-200' },
      'Waiting': { gradient: 'bg-gradient-to-r from-yellow-500 to-amber-500', ring: 'ring-yellow-200' },
      'Coming Soon': { gradient: 'bg-gradient-to-r from-red-500 to-orange-500', ring: 'ring-red-200' },
      'Not Fixed': { gradient: 'bg-gradient-to-r from-gray-500 to-gray-600', ring: 'ring-gray-200' }
    };
    return {
      ...colorMap[normalizedStatus],
      text: baseColors.text,
      bg: baseColors.bg
    };
  };

  const isConfirmed = (status: string) => status.trim() === 'Confirmed';

  const hasValidRegistrationLink = (link?: string) =>
    !!link && link.trim().length > 0 && (link.startsWith('http://') || link.startsWith('https://'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-red-50/20 to-orange-50/20">
      <PageHeader
        title="Upcoming Webinars"
        subtitle="Join our free sessions led by industry experts. Register now and elevate your skills!"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-red-200 rounded-full animate-spin border-t-red-600" />
              </div>
              <p className="text-gray-700 text-xl font-semibold mt-6">Loading webinars...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait</p>
            </div>
          )}

          {/* Error State */}
          <AnimatePresence>
            {error && !loading && (
              <AnimatedSection>
                <div className="text-center py-12 backdrop-blur-sm bg-white/80 rounded-3xl shadow-lg border border-red-200 p-10 max-w-2xl mx-auto">
                  <div className="mb-5 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Unable to Load Webinars</h2>
                  </div>
                  <p className="text-gray-700 mb-6">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    style={{ boxShadow: '0 10px 40px -10px rgba(220,38,38,0.4)' }}
                  >
                    Retry Loading
                  </motion.button>
                </div>
              </AnimatedSection>
            )}
          </AnimatePresence>

          {/* No Webinars */}
          {!loading && !error && webinars.length === 0 && (
            <AnimatedSection>
              <div className="text-center py-16 backdrop-blur-sm bg-white/80 rounded-3xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">No Webinars Scheduled</h2>
                <p className="text-gray-700 mb-2">
                  We don't have any webinars scheduled right now.
                </p>
                <p className="text-gray-500 text-sm">
                  Check back soon for upcoming events!
                </p>
              </div>
            </AnimatedSection>
          )}

          {/* Webinar Grid */}
          {!loading && !error && webinars.length > 0 && (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/70 border border-gray-200 rounded-full mb-4 shadow-sm">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                    {webinars.length} upcoming {webinars.length === 1 ? 'webinar' : 'webinars'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {webinars.map((event: Webinar, index: number) => {
                  const colors = getStatusColors(event.status);
                  const showFullDetails = isConfirmed(event.status);
                  const hasRegistration = hasValidRegistrationLink(event.registrationLink);

                  return (
                    <AnimatedSection key={event.id} delay={index * 0.08}>
                      <motion.article
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={index}
                        whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
                        className={`flex flex-col justify-between backdrop-blur-sm bg-white/90 rounded-3xl shadow-lg border border-gray-100 ring-2 ${colors.ring} overflow-hidden transition-all`}
                        aria-label={`Webinar: ${event.title}`}
                      >
                        {/* Status Banner */}
                        <div className={`px-6 py-3 text-center text-base font-bold text-white ${colors.gradient} flex items-center justify-center gap-3`}>
                          {statusIcons[event.status.trim()] ?? <Info />}
                          <span className="uppercase tracking-wider">{event.status}</span>
                        </div>

                        <div className="p-7 flex flex-col flex-1">
                          {/* Title */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>

                          {/* Confirmed: Details */}
                          {showFullDetails ? (
                            <>
                              <div className="space-y-2 mb-6">
                                {event.date && (
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="text-red-500" size={18} aria-label="Date" />
                                    <time dateTime={event.date}>{formatWebinarDate(event.date)}</time>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="text-orange-500" size={18} aria-label="Location" />
                                  <span>{event.location}</span>
                                </div>
                                {event.description && (
                                  <p className="text-gray-600 text-sm leading-relaxed mt-2">{event.description}</p>
                                )}
                              </div>
                              {hasRegistration ? (
                                <motion.a
                                  href={event.registrationLink!.trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-auto"
                                  aria-label="Register now"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:from-red-700 hover:to-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    style={{ boxShadow: '0 10px 30px -10px rgba(220,38,38,0.4)' }}
                                  >
                                    <UserCheck size={18} />
                                    Register Now
                                    <ExternalLink size={14} />
                                  </div>
                                </motion.a>
                              ) : (
                                <div className="mt-auto w-full text-center py-3 px-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-700 font-semibold rounded-xl text-sm">
                                  Registration Opening Soon
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {/* Not Confirmed */}
                              <div className="flex flex-col items-center justify-center gap-2 py-10">
                                <span className="text-5xl">{event.status === 'Waiting' ? '⏳' : event.status === 'Coming Soon' ? '🔜' : '📅'}</span>
                                <span className="font-medium text-gray-700">
                                  {event.status === 'Waiting'
                                    ? 'Details coming soon.'
                                    : 'Stay tuned for details.'}
                                </span>
                                {event.description && (
                                  <p className="text-gray-400 text-xs mt-2 text-center">{event.description}</p>
                                )}
                              </div>
                              <div
                                className={`mt-auto w-full text-center py-3 px-5 rounded-xl text-sm font-semibold border border-gray-200 ${colors.text} ${colors.bg}`}
                              >
                                Stay Tuned
                              </div>
                            </>
                          )}
                        </div>
                      </motion.article>
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
