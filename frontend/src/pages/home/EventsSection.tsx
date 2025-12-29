// frontend/src/pages/home/EventsSection.tsx
import { memo } from 'react';
import { Calendar, TrendingUp, Users, Video, Mic, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

// Event-themed icons for decoration
const decorIcons = [
  { Icon: Video, color: '#f97316' },
  { Icon: Mic, color: '#8b5cf6' },
  { Icon: Users, color: '#22c55e' },
  { Icon: BookOpen, color: '#06b6d4' },
];

const EventsSection = memo(() => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-red-50/30 to-orange-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #dc2626 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Static gradient orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-red-300/20 to-orange-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-gray-300/20 to-slate-300/20 rounded-full blur-3xl" />

      {/* Static event theme icons */}
      <div className="absolute inset-0 pointer-events-none">
        {decorIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.05]"
            style={{
              top: `${20 + i * 18}%`,
              left: i % 2 === 0 ? '8%' : 'auto',
              right: i % 2 === 1 ? '8%' : 'auto',
              color: item.color,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.05, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          >
            <item.Icon size={45} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            {/* Badge with hover */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/70 border border-gray-200 rounded-full shadow-lg mb-6"
            >
              <Calendar className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Upcoming Events</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join Our <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Free Webinars</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-xl text-center text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Learn from industry experts — no cost, no risk.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  to="/events"
                  variant="primary"
                  size="xl"
                  style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    color: "#fff",
                    boxShadow: "0 15px 40px -10px rgba(220,38,38,0.4)"
                  }}
                  className="shadow-2xl hover:shadow-3xl"
                >
                  View Events & Register
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats with entrance animation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center gap-6 flex-wrap"
            >
              <p className="text-center text-gray-500 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                1,000+ professionals attended
              </p>
              <p className="text-center text-gray-500 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                100% Free Access
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

EventsSection.displayName = 'EventsSection';
export default EventsSection;