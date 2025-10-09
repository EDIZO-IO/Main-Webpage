// src/pages/UpcomingWebinars.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, MapPin, UserCheck } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

// Updated interface with new statuses
interface Webinar {
  id: number;
  title: string;
  date: string; // Can be empty string if not fixed
  status: 'Coming Soon' | 'Confirmed' | 'Waiting' | 'Not Fixed'; // Updated status options
  location: string;
  description: string;
  registrationLink?: string;
}

const UpcomingWebinars: React.FC = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWebinars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/webinars.json');
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Webinars data file not found (/webinars.json)');
          } else {
            throw new Error(`Failed to load webinars: ${response.status} ${response.statusText}`);
          }
        }
        const data: Webinar[] = await response.json();

        // Filter out 'Not Fixed' webinars
        const filteredData = data.filter(webinar => webinar.status !== 'Not Fixed');

        // Sort: 'Confirmed' first, then 'Waiting', then 'Coming Soon', then by date if needed within confirmed
        const sorted = filteredData.sort((a, b) => {
          // Priority map: Confirmed (0), Waiting (1), Coming Soon (2)
          const statusPriority: Record<string, number> = {
            'Confirmed': 0,
            'Waiting': 1,
            'Coming Soon': 2
          };

          const priorityA = statusPriority[a.status] ?? 3; // Default to a high number if status not mapped
          const priorityB = statusPriority[b.status] ?? 3;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // If statuses have the same priority, and both are 'Confirmed', sort by date
          if (a.status === 'Confirmed' && b.status === 'Confirmed') {
            return a.date.localeCompare(b.date);
          }

          // If statuses are the same and not 'Confirmed', maintain original order or sort by ID
          return a.id - b.id;
        });

        setWebinars(sorted);
        setLoading(false);
      } catch (err) {
        console.error('Error loading webinars:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while loading webinars.');
        setLoading(false);
      }
    };

    loadWebinars();
  }, []);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Date TBD'; // Handle empty date string
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

  // Filter webinars to show only those that should be displayed
  const displayedWebinars = webinars.filter(webinar => webinar.status !== 'Not Fixed');

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
              <p className="text-gray-600 text-lg">Loading upcoming events...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <AnimatedSection>
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-red-100 p-8">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Webinars</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            </AnimatedSection>
          )}

          {/* No Webinars (after filtering) */}
          {!loading && !error && displayedWebinars.length === 0 && (
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
          {!loading && !error && displayedWebinars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedWebinars.map((event, index) => (
                <AnimatedSection key={event.id} delay={index * 0.1}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Status Banner */}
                    <div className={`px-6 py-3 text-center text-sm font-semibold text-white ${
                      event.status === 'Confirmed'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : event.status === 'Waiting'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' // Different color for Waiting
                        : 'bg-gradient-to-r from-gray-500 to-gray-600' // Color for Coming Soon
                    }`}>
                      {event.status}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>

                      {/* Conditional Rendering based on Status */}
                      {event.status === 'Confirmed' ? (
                        <>
                          {/* Event Details for Confirmed */}
                          <div className="space-y-2 mb-4 flex-grow">
                            <div className="flex items-start text-gray-600">
                              <Calendar className="flex-shrink-0 mr-2 mt-0.5 text-red-500" size={18} />
                              <span className="text-sm">
                                <time dateTime={event.date}>{formatDate(event.date)}</time>
                              </span>
                            </div>
                            <div className="flex items-start text-gray-600">
                              <MapPin className="flex-shrink-0 mr-2 mt-0.5 text-red-500" size={18} />
                              <span className="text-sm">{event.location}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-3">{event.description}</p>
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
                        // Render minimal info for 'Waiting' or 'Coming Soon'
                        <>
                          <div className="flex-grow"></div> {/* Spacer */}
                          <div className="mt-auto w-full text-center py-3 px-5 bg-gray-100 text-gray-500 font-semibold rounded-lg text-sm">
                            Details Coming Soon
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UpcomingWebinars;


// confirmed , waiting , Not Fixed , coming soon  this are the status