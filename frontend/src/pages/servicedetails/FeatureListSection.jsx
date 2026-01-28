import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FeatureListItem = memo(({ feature, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    className="flex items-start p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white hover:bg-white/80 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 group"
  >
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-green-200/50">
      <CheckCircle size={16} strokeWidth={3} />
    </div>
    <span className="text-gray-700 font-medium pt-1 group-hover:text-gray-900 transition-colors">{feature}</span>
  </motion.li>
));
FeatureListItem.displayName = 'FeatureListItem';

const FeatureListSection = memo(({ title, features, icon }) => (
  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-6 overflow-hidden">
    {/* Decorative gradient */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/50 to-transparent rounded-bl-full" />

    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center relative z-10">
      <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-green-200/50 mr-3">
        {icon}
      </div>
      {title}
    </h3>
    <ul className="space-y-3 relative z-10">
      {features.map((feature, i) => (
        <FeatureListItem key={i} feature={feature} index={i} />
      ))}
    </ul>
  </div>
));
FeatureListSection.displayName = 'FeatureListSection';

export default FeatureListSection;
