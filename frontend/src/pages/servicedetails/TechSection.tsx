import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

const TechnologyBadge = memo<{ tech: string; index: number }>(({ tech, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200 shadow-sm hover:shadow-md transition-all cursor-default"
  >
    {tech}
  </motion.span>
));
const TechSection = memo<{ technologies: string[] }>(({ technologies }) => (
  <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
    <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
      <Code className="text-purple-600 mr-3" size={28} />
      Technologies We Use
    </h3>
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech, index) => (
        <TechnologyBadge key={index} tech={tech} index={index} />
      ))}
    </div>
  </div>
));
export default TechSection;
