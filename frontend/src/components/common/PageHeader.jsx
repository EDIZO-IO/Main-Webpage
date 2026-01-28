import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Code, Palette, Video, BarChart2, Globe, Zap,
  Server, PenTool, Bot, Sparkles, Film
} from 'lucide-react';

// Floating icons configuration
const leftIcons = [
  { Icon: Code, color: 'from-green-400 to-emerald-600' },
  { Icon: Palette, color: 'from-pink-400 to-rose-600' },
  { Icon: Video, color: 'from-cyan-400 to-blue-600' },
  { Icon: Globe, color: 'from-orange-400 to-red-600' },
];

const rightIcons = [
  { Icon: Server, color: 'from-purple-400 to-violet-600' },
  { Icon: PenTool, color: 'from-fuchsia-400 to-pink-600' },
  { Icon: Bot, color: 'from-amber-400 to-orange-600' },
  { Icon: Film, color: 'from-teal-400 to-emerald-600' },
];

const PageHeader = memo(({
  title,
  subtitle,
  badge = "EDIZO • Design.Develop.Learn",
  showServiceIcons = true,
  showStats = false,
  stats,
  children,
  className = '',
  backgroundImage,
  backgroundOpacity = 0.1,
}) => {
  return (
    <motion.section
      className={`relative text-gray-900 min-h-[380px] md:min-h-[440px] lg:min-h-[500px] flex items-center justify-center overflow-hidden py-16 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: backgroundImage
            ? `linear-gradient(rgba(255, 255, 255, ${backgroundOpacity}), rgba(255, 255, 255, ${backgroundOpacity})), url(${backgroundImage}) center/cover`
            : '#ffffff',
        }}
      ></div>

      {/* Floating Skill Icons - Left */}
      {showServiceIcons && (
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-[5]">
          {leftIcons.map((item, i) => (
            <motion.div
              key={`left-${i}`}
              className="p-3 rounded-xl border border-gray-200 shadow-xl cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, y: [-8, 0] }}
              transition={{
                opacity: { delay: 0.5 + i * 0.1, duration: 0.5 },
                x: { delay: 0.5 + i * 0.1, duration: 0.5 },
                y: { repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3 }
              }}
              whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                <item.Icon size={20} className="text-gray-700" strokeWidth={2} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Skill Icons - Right */}
      {showServiceIcons && (
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-[5]">
          {rightIcons.map((item, i) => (
            <motion.div
              key={`right-${i}`}
              className="p-3 rounded-xl border border-gray-200 shadow-xl cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0, y: [8, 0] }}
              transition={{
                opacity: { delay: 0.5 + i * 0.1, duration: 0.5 },
                x: { delay: 0.5 + i * 0.1, duration: 0.5 },
                y: { repeat: Infinity, duration: 3.5 + i * 0.4, delay: i * 0.25 }
              }}
              whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                <item.Icon size={20} className="text-gray-700" strokeWidth={2} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content with White Card */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* White Container */}
          <div
            className="text-center p-8 md:p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-orange-500" />
              </motion.div>
              <span className="text-gray-700 text-sm font-semibold">{badge}</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900">
                {title}
              </span>
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-base md:text-lg lg:text-xl font-medium max-w-2xl mx-auto text-gray-600 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Custom children content (buttons, etc.) */}
            {children && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {children}
              </motion.div>
            )}

            {/* Stats Row */}
            {showStats && stats && stats.length > 0 && (
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Service Category Icons on Mobile */}
            {showServiceIcons && (
              <motion.div
                className="flex lg:hidden items-center justify-center gap-2 mt-6 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {[
                  { Icon: Palette, color: 'from-pink-400 to-rose-600' },
                  { Icon: Code, color: 'from-orange-400 to-red-600' },
                  { Icon: Video, color: 'from-cyan-400 to-blue-600' },
                  { Icon: BarChart2, color: 'from-green-400 to-emerald-600' },
                  { Icon: Globe, color: 'from-purple-400 to-violet-600' },
                  { Icon: Zap, color: 'from-fuchsia-400 to-pink-600' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(230, 230, 230, 0.5)',
                    }}
                    whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.2)' }}
                    animate={{ y: [-3, 0] }}
                    transition={{ y: { repeat: Infinity, duration: 2 + i * 0.2, delay: i * 0.1 } }}
                  >
                    <item.Icon className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-100/20 via-gray-100/40 to-transparent z-[4]" />
    </motion.section>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
