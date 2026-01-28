import { memo } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

const TechnologyBadge = memo(({ tech, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    whileHover={{ scale: 1.08, y: -3 }}
    className="px-4 py-2.5 bg-gradient-to-br from-purple-50 to-indigo-100 text-purple-800 rounded-xl text-sm font-semibold border border-purple-200/50 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 transition-all cursor-default backdrop-blur-sm"
  >
    {tech}
  </motion.span>
));
TechnologyBadge.displayName = 'TechnologyBadge';

const TechSection = memo(({ technologies }) => (
  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white overflow-hidden">
    {/* Decorative gradient */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-transparent rounded-bl-full" />

    <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center relative z-10">
      <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-200/50 mr-4">
        <Code size={24} />
      </div>
      Technologies We Use
    </h3>
    <div className="flex flex-wrap gap-3 relative z-10">
      {technologies.map((tech, index) => (
        <TechnologyBadge key={index} tech={tech} index={index} />
      ))}
    </div>
  </div>
));
TechSection.displayName = 'TechSection';

export default TechSection;
