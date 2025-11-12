import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Clock, Target } from 'lucide-react';

const stats = [
  { icon: <TrendingUp className="w-7 h-7" />, value: "100+", label: "Projects Done", border: "border-blue-500", color: "text-blue-700" },
  { icon: <Star className="w-7 h-7" />, value: "4.9/5", label: "Client Rating", border: "border-yellow-400", color: "text-yellow-500" },
  { icon: <Clock className="w-7 h-7" />, value: "On Time", label: "Delivery", border: "border-green-600", color: "text-green-600" },
  { icon: <Target className="w-7 h-7" />, value: "100%", label: "Satisfaction", border: "border-red-600", color: "text-red-600" },
];

const StatsSection = memo(() => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
    {stats.map((stat, index) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.04 }}
        className="bg-white p-7 rounded-2xl flex flex-col items-center text-center shadow border border-gray-200 hover:shadow-lg transition-all"
      >
        <div className={`flex items-center justify-center w-14 h-14 mb-3 rounded-full border-2 ${stat.border} bg-gray-50`}>
          <div className={`${stat.color}`}>{stat.icon}</div>
        </div>
        <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
        <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
      </motion.div>
    ))}
  </div>
));
StatsSection.displayName = 'StatsSection';

export default StatsSection;
