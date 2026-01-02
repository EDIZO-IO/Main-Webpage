import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Clock, Target } from 'lucide-react';

const stats = [
  { icon: <TrendingUp className="w-6 h-6" />, value: "100+", label: "Projects Done", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200/50" },
  { icon: <Star className="w-6 h-6" />, value: "4.9/5", label: "Client Rating", gradient: "from-yellow-400 to-orange-500", shadow: "shadow-yellow-200/50" },
  { icon: <Clock className="w-6 h-6" />, value: "On Time", label: "Delivery", gradient: "from-green-500 to-emerald-600", shadow: "shadow-green-200/50" },
  { icon: <Target className="w-6 h-6" />, value: "100%", label: "Satisfaction", gradient: "from-red-500 to-pink-600", shadow: "shadow-red-200/50" },
];

const StatsSection = memo(() => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
    {stats.map((stat, index) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="relative bg-white/70 backdrop-blur-xl p-6 rounded-2xl flex flex-col items-center text-center shadow-xl border border-white hover:shadow-2xl transition-all duration-300 overflow-hidden group"
      >
        {/* Decorative gradient */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

        <div className={`flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
          {stat.icon}
        </div>
        <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
      </motion.div>
    ))}
  </div>
));
StatsSection.displayName = 'StatsSection';

export default StatsSection;
