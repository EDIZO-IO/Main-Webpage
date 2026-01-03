import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Clock, Target } from 'lucide-react';
import { useStats } from '../../components/hooks/useStats';

const statConfig = [
  { key: 'projects_delivered', icon: <TrendingUp className="w-6 h-6" />, gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200/50" },
  { key: 'client_rating', icon: <Star className="w-6 h-6" />, gradient: "from-yellow-400 to-orange-500", shadow: "shadow-yellow-200/50" },
  { key: 'on_time_delivery', icon: <Clock className="w-6 h-6" />, gradient: "from-green-500 to-emerald-600", shadow: "shadow-green-200/50" },
  { key: 'satisfaction_rate', icon: <Target className="w-6 h-6" />, gradient: "from-red-500 to-pink-600", shadow: "shadow-red-200/50" },
];

const StatsSection = memo(() => {
  const { stats } = useStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {statConfig.map((config, index) => {
        const statData = stats[config.key] || { value: 'Loading...', label: 'Loading...' };

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative bg-white/70 backdrop-blur-xl p-6 rounded-2xl flex flex-col items-center text-center shadow-xl border border-white hover:shadow-2xl transition-all duration-300 overflow-hidden group"
          >
            {/* Decorative gradient */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${config.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

            <div className={`flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg ${config.shadow} group-hover:scale-110 transition-transform duration-300`}>
              {config.icon}
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-1">{statData.value}</div>
            <div className="text-sm text-gray-600 font-medium">{statData.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
});
StatsSection.displayName = 'StatsSection';

export default StatsSection;
