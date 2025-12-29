import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FeatureListItem = memo<{ feature: string; index: number }>(({ feature, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    className="flex items-start group"
  >
    <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
  </motion.li>
));
FeatureListItem.displayName = 'FeatureListItem';

const FeatureListSection = memo<{ title: string; features: string[]; icon: React.ReactNode }>(({ title, features, icon }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      {icon}
      {title}
    </h3>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <FeatureListItem key={i} feature={feature} index={i} />
      ))}
    </ul>
  </div>
));
export default FeatureListSection;
