// frontend/src/pages/home/EventsSection.tsx
import { memo } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

const EventsSection = memo(() => {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full shadow-sm">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">Upcoming Events</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-6">
              Join Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Free Webinars</span>
            </h2>

            <p className="text-xl text-center text-gray-600 mb-8">
              Learn from industry experts — no cost, no risk.
            </p>

            <div className="flex justify-center mb-6">
              <Button
                to="/events"
                variant="primary"
                size="xl"
                style={{
                  background: "linear-gradient(90deg, #fbbf24 0%, #f43f5e 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 20px 0 rgba(251,191,36,0.3),0 8px 24px 0 rgba(244,63,94,0.2)"
                }}
                className="shadow-2xl hover:shadow-3xl"
              >
                View Events & Register
              </Button>
            </div>

            <p className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              1,000+ professionals attended
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

EventsSection.displayName = 'EventsSection';
export default EventsSection;