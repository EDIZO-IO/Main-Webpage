// frontend/src/pages/home/EventsSection.tsx
import { memo } from 'react';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

const EventsSection = memo(() => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-red-50/20 to-orange-50/20 relative overflow-hidden">
      {/* Simple static background */}
      <div className="absolute top-10 right-10 w-48 h-48 bg-red-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-orange-100/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-gray-200 rounded-full shadow-sm mb-5">
              <Calendar className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Upcoming Events</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Join Our <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Free Webinars</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6">
              Learn from industry experts — no cost, no risk.
            </p>

            {/* CTA Button */}
            <div className="mb-6">
              <Button
                to="/events"
                variant="primary"
                size="lg"
                style={{
                  background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                  boxShadow: "0 10px 30px -8px rgba(220,38,38,0.4)"
                }}
              >
                View Events & Register
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                1,000+ professionals attended
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                100% Free Access
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

EventsSection.displayName = 'EventsSection';
export default EventsSection;