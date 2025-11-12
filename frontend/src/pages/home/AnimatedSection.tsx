// frontend/src/pages/home/AnimatedSection.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedSection = memo<AnimatedSectionProps>(({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
));

AnimatedSection.displayName = 'AnimatedSection';