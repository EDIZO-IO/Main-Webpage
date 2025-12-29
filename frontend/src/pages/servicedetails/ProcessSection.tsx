import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const ProcessStep = memo<{ step: string; index: number; total: number }>(({ step, index, total }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="flex items-start group"
  >
    <div className="flex-shrink-0 mr-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
          {index + 1}
        </div>
        {index < total - 1 && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-red-300 to-transparent" />
        )}
      </div>
    </div>
    <div className="flex-1 pt-2">
      <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
        {step}
      </h4>
      <p className="text-gray-600 text-sm">
        Step {index + 1} of {total}
      </p>
    </div>
  </motion.div>
));
ProcessStep.displayName = 'ProcessStep';

const ProcessSection = memo<{ process: string[] }>(({ process }) => (
  <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
    <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
      <Settings className="text-blue-600 mr-3" size={28} />
      Our Process
    </h3>
    <div className="space-y-8">
      {process.map((step, index) => (
        <ProcessStep key={index} step={step} index={index} total={process.length} />
      ))}
    </div>
  </div>
));
export default ProcessSection;
