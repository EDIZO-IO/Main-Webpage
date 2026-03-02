import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ArrowRight, Loader2 } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import Button from '../../components/common/Button';
import { useEvents } from '../../hooks/useEvents';

const EventsSection = memo(() => {
  const { events, loading, error } = useEvents(null, true); // Get upcoming events
  const [displayEvents, setDisplayEvents] = useState([]);

  useEffect(() => {
    if (events && events.length > 0) {
      // Take first 3 upcoming events
      setDisplayEvents(events.slice(0, 3));
    } else if (!loading) {
      // No events from API, show empty state
      setDisplayEvents([]);
    }
  }, [events, loading]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-4 shadow-sm">
              <Calendar className="w-3 h-3 text-orange-500" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Upcoming Events</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Events</span>
            </h2>
            <p className="text-gray-600">
              Workshops, webinars, and networking opportunities
            </p>
          </AnimatedSection>
        </div>

        {/* Events Grid */}
        {displayEvents.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {displayEvents.map((event, index) => (
              <AnimatedSection key={event.id || index} animation="fadeInUp" delay={index * 0.1}>
                <motion.div
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                  whileHover={{ y: -8 }}
                >
                  {/* Date Badge */}
                  <div className="absolute -top-4 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="text-center">
                      <div className="text-xs font-semibold uppercase">Date</div>
                      <div className="text-sm font-bold">{formatDate(event.start_date)}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {event.description || event.short_description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{event.mode || 'Online'}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                      {event.max_participants && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>{event.max_participants} Seats</span>
                        </div>
                      )}
                    </div>

                    {/* Register Button */}
                    <Button
                      onClick={() => window.location.href = event.registration_link || '/contact'}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      Register Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-4">
              <Calendar className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600 mb-6">Check back later for our upcoming events and workshops</p>
          </div>
        )}

        {/* View All Events */}
        <div className="text-center">
          <AnimatedSection>
            <Button
              onClick={() => window.location.href = '/events'}
              className="bg-white border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all inline-flex items-center gap-2"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Button>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

EventsSection.displayName = 'EventsSection';

export default EventsSection;
