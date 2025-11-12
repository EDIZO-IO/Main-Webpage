// frontend/src/pages/home/FinalCTA.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useGoogleEvents } from '../../components/hooks/useGoogleEvents';
import { AnimatedSection } from './AnimatedSection';

const FinalCTA = memo(() => {
  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();
  
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        />
      </div>

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 pointer-events-none"
          style={{
            width: `${80 + i * 50}px`,
            height: `${80 + i * 50}px`,
            left: `${15 + (i * 30) % 70}%`,
            top: `${15 + (i * 20) % 60}%`,
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Ready to Be Our Next Success Story?
            </h2>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 10+ clients who trust us with their digital transformation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                to="/contact"
                variant="primary"
                size="xl"
                enableFestivalAnimation={true}
                showFestivalEmoji={true}
                iconRight={<ArrowRight className="w-6 h-6" />}
                className="shadow-2xl hover:shadow-3xl"
              >
                Contact Us Today
              </Button>
              <Button
                to="/services"
                variant="secondary"
                size="xl"
                enableFestivalAnimation={false}
                showFestivalEmoji={false}
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl"
              >
                View Our Services
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">100% Client Satisfaction Guaranteed</span>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

FinalCTA.displayName = 'FinalCTA';
export default FinalCTA;