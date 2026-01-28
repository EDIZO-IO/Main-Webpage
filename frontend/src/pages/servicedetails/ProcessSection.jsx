import { memo } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const ProcessStep = memo(({ step, index, total }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="flex items-start group"
  >
    <div className="flex-shrink-0 mr-4">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-red-200/50 transition-transform duration-300"
        >
          {index + 1}
        </motion.div>
        {index < total - 1 && (
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-red-300 to-transparent" />
        )}
      </div>
    </div>
    <div className="flex-1 pt-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white group-hover:bg-white/80 group-hover:shadow-lg transition-all duration-300">
      <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
        {step}
      </h4>
      <p className="text-gray-500 text-sm">
        Step {index + 1} of {total}
      </p>
    </div>
  </motion.div>
));
ProcessStep.displayName = 'ProcessStep';

const ProcessSection = memo(({ process }) => (
  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white overflow-hidden">
    {/* Decorative gradient */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-transparent rounded-bl-full" />

    <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center relative z-10">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-200/50 mr-4">
        <Settings size={24} />
      </div>
      Our Process
    </h3>
    <div className="space-y-6 relative z-10">
      {process.map((step, index) => (
        <ProcessStep key={index} step={step} index={index} total={process.length} />
      ))}
    </div>
  </div>
));
ProcessSection.displayName = 'ProcessSection';

export default ProcessSection;
