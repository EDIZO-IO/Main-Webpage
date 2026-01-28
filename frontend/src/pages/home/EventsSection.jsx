// frontend/src/pages/home/EventsSection.tsx
import { memo } from 'react';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

const EventsSection = memo(() => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-4">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Upcoming Events</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Free Webinars</span>
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                    Learn from industry experts — no cost, no risk.
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-8 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      1,000+ professionals attended
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      100% Free Access
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    to="/events"
                    variant="primary"
                    size="lg"
                    className="rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    }}
                  >
                    View Events & Register
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

EventsSection.displayName = 'EventsSection';
export default EventsSection;