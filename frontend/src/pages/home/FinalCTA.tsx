// frontend/src/pages/home/FinalCTA.tsx
import { memo } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Video, Server, Bot, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

// Service theme icons for background decoration
const decorIcons = [
  { Icon: Code, color: 'rgba(34,197,94,0.3)' },
  { Icon: Palette, color: 'rgba(244,63,94,0.3)' },
  { Icon: Video, color: 'rgba(249,115,22,0.3)' },
  { Icon: Server, color: 'rgba(139,92,246,0.3)' },
  { Icon: Bot, color: 'rgba(6,182,212,0.3)' },
  { Icon: Globe, color: 'rgba(236,72,153,0.3)' },
];

const FinalCTA = memo(() => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        />
      </div>

      {/* Static gradient orbs with brand colors */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-full blur-3xl" />

      {/* Static service theme icons as faded decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {decorIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${10 + (i % 3) * 35}%`,
              left: i < 3 ? `${5 + i * 8}%` : 'auto',
              right: i >= 3 ? `${5 + (i - 3) * 8}%` : 'auto',
              color: item.color,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          >
            <item.Icon size={40} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            {/* Icon with brand colors */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-8 shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title with entrance animation */}
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to Be Our Next Success Story?
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join 10+ clients who trust us with their digital transformation.
            </motion.p>

            {/* Service category icons row */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-10 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[Code, Palette, Video, Bot, Server, Globe].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="w-12 h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-6 h-6 text-white/70" strokeWidth={1.5} />
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  to="/contact"
                  variant="primary"
                  size="xl"
                  iconRight={<ArrowRight className="w-6 h-6" />}
                  style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    boxShadow: "0 15px 40px -10px rgba(220,38,38,0.5)"
                  }}
                  className="shadow-2xl hover:shadow-3xl"
                >
                  Contact Us Today
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  to="/services"
                  variant="secondary"
                  size="xl"
                  className="backdrop-blur-xl bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-gray-900 shadow-lg hover:shadow-xl"
                >
                  View Our Services
                </Button>
              </motion.div>
            </motion.div>

            {/* Guarantee badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center justify-center gap-6 flex-wrap text-gray-400"
            >
              <span className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                100% Satisfaction Guaranteed
              </span>
              <span className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Free Consultation
              </span>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

FinalCTA.displayName = 'FinalCTA';
export default FinalCTA;