import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Code, Palette, Video, BarChart2, Globe, Zap,
  Server, PenTool, Bot, Sparkles, Film
} from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  badge?: string;
  showServiceIcons?: boolean;
  showStats?: boolean;
  stats?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

// Floating icons configuration
const leftIcons = [
  { Icon: Code, color: 'from-green-400 to-emerald-600' },
  { Icon: Palette, color: 'from-pink-400 to-rose-600' },
  { Icon: Bot, color: 'from-cyan-400 to-blue-600' },
  { Icon: Video, color: 'from-orange-400 to-red-600' },
];

const rightIcons = [
  { Icon: Server, color: 'from-purple-400 to-violet-600' },
  { Icon: PenTool, color: 'from-fuchsia-400 to-pink-600' },
  { Icon: Film, color: 'from-amber-400 to-orange-600' },
  { Icon: Globe, color: 'from-teal-400 to-emerald-600' },
];

const PageHeader = memo<PageHeaderProps>(({
  title,
  subtitle,
  badge = "EDIZO • Design.Develop.Learn",
  showServiceIcons = true,
  showStats = false,
  stats,
  children,
}) => {
  return (
    <motion.section
      className="relative text-white min-h-[380px] md:min-h-[440px] lg:min-h-[500px] flex items-center justify-center overflow-hidden py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/assets/images/hero-poster.jpg"
      >
        <source src="/assets/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Enhanced Dark overlay with diagonal gradient */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.78) 50%, rgba(15, 23, 42, 0.92) 100%)'
      }} />

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 z-[2] opacity-50">
        <motion.div
          className="absolute w-[600px] h-[600px] -top-48 -left-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] top-1/2 -right-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 60%)' }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] -bottom-32 left-1/3 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* Floating Glass Skill Icons - Left */}
      {showServiceIcons && (
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-[5]">
          {leftIcons.map((item, i) => (
            <motion.div
              key={`left-${i}`}
              className="p-3 rounded-xl backdrop-blur-xl border border-white/20 shadow-xl cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: 0.5 + i * 0.1, duration: 0.5 },
                x: { delay: 0.5 + i * 0.1, duration: 0.5 },
                y: { repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3 }
              }}
              whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                <item.Icon size={20} className="text-white" strokeWidth={2} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Glass Skill Icons - Right */}
      {showServiceIcons && (
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-[5]">
          {rightIcons.map((item, i) => (
            <motion.div
              key={`right-${i}`}
              className="p-3 rounded-xl backdrop-blur-xl border border-white/20 shadow-xl cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
              transition={{
                opacity: { delay: 0.5 + i * 0.1, duration: 0.5 },
                x: { delay: 0.5 + i * 0.1, duration: 0.5 },
                y: { repeat: Infinity, duration: 3.5 + i * 0.4, delay: i * 0.25 }
              }}
              whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                <item.Icon size={20} className="text-white" strokeWidth={2} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content with Glass Card */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glass Container */}
          <div
            className="text-center p-8 md:p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Inner glow effects */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-500/20 to-transparent rounded-tr-full" />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <span className="text-white/90 text-sm font-semibold">{badge}</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-white">
                {title}
              </span>
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-base md:text-lg lg:text-xl font-medium max-w-2xl mx-auto text-white/70 mb-6"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {children}
              </motion.div>
            )}

            {/* Stats Row */}
            {showStats && stats && stats.length > 0 && (
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8 pt-6 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/60 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Service Category Icons on Mobile */}
            {showServiceIcons && (
              <motion.div
                className="flex lg:hidden items-center justify-center gap-2 mt-6 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {[
                  { Icon: Palette, color: 'from-pink-400 to-rose-600' },
                  { Icon: Video, color: 'from-orange-400 to-red-600' },
                  { Icon: Bot, color: 'from-cyan-400 to-blue-600' },
                  { Icon: Code, color: 'from-green-400 to-emerald-600' },
                  { Icon: Server, color: 'from-purple-400 to-violet-600' },
                  { Icon: BarChart2, color: 'from-fuchsia-400 to-pink-600' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                    whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.2)' }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ y: { repeat: Infinity, duration: 2 + i * 0.2, delay: i * 0.1 } }}
                  >
                    <item.Icon className="w-5 h-5 text-white/80" strokeWidth={1.5} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade to gray-50 */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/10 via-white/10 to-transparent z-[4]" />
    </motion.section>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
