import React from 'react';
import { motion } from 'framer-motion';
import {
  Code, Palette, Smartphone, Video, BarChart2, Globe, Zap,
  Layers, Server, PenTool, Camera, Cpu, Database,
  Wand2, Sparkles, Film, Monitor, Brush, Share2, Bot
} from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  variant?: 'default' | 'services' | 'contact' | 'internships' | 'about' | 'events';
}

// Service-themed floating icons with categories
const serviceCategories = {
  graphics: [
    { Icon: Palette, color: '#f43f5e' },
    { Icon: PenTool, color: '#ec4899' },
    { Icon: Brush, color: '#d946ef' },
    { Icon: Layers, color: '#a855f7' },
  ],
  video: [
    { Icon: Video, color: '#f97316' },
    { Icon: Film, color: '#fb923c' },
    { Icon: Camera, color: '#fbbf24' },
  ],
  ai: [
    { Icon: Bot, color: '#06b6d4' },
    { Icon: Cpu, color: '#0ea5e9' },
    { Icon: Wand2, color: '#38bdf8' },
    { Icon: Sparkles, color: '#22d3ee' },
  ],
  development: [
    { Icon: Code, color: '#22c55e' },
    { Icon: Server, color: '#10b981' },
    { Icon: Database, color: '#14b8a6' },
    { Icon: Globe, color: '#34d399' },
  ],
  marketing: [
    { Icon: BarChart2, color: '#8b5cf6' },
    { Icon: Share2, color: '#a78bfa' },
    { Icon: Monitor, color: '#c4b5fd' },
    { Icon: Smartphone, color: '#ddd6fe' },
  ],
};

// All icons flattened for floating effect
const allServiceIcons = [
  ...serviceCategories.graphics,
  ...serviceCategories.video,
  ...serviceCategories.ai,
  ...serviceCategories.development,
  ...serviceCategories.marketing,
];

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <motion.div
      className="relative h-80 md:h-96 lg:h-[28rem] text-white flex items-center justify-center overflow-hidden"
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

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 z-[2] opacity-30">
        <motion.div
          className="absolute w-[600px] h-[600px] -top-64 -left-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] -bottom-32 -right-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating service icons - Left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 overflow-hidden pointer-events-none z-[3]">
        {allServiceIcons.slice(0, 8).map((item, i) => (
          <motion.div
            key={`left-${i}`}
            className="absolute"
            style={{
              left: `${5 + (i % 4) * 20}%`,
              top: `${8 + i * 10}%`,
              color: item.color,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 15, -15, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i * 0.7,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            <item.Icon size={20 + (i % 3) * 6} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      {/* Floating service icons - Right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 overflow-hidden pointer-events-none z-[3]">
        {allServiceIcons.slice(8, 16).map((item, i) => (
          <motion.div
            key={`right-${i}`}
            className="absolute"
            style={{
              right: `${5 + (i % 4) * 20}%`,
              top: `${12 + i * 10}%`,
              color: item.color,
            }}
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              rotate: [0, -15, 15, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + i * 0.5,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          >
            <item.Icon size={18 + (i % 3) * 6} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      {/* Connecting animated lines */}
      <svg className="absolute inset-0 w-full h-full z-[2] pointer-events-none opacity-20">
        <motion.line
          x1="10%"
          y1="20%"
          x2="30%"
          y2="80%"
          stroke="url(#lineGradient1)"
          strokeWidth="1"
          strokeDasharray="5,5"
          animate={{
            strokeDashoffset: [0, 100],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.line
          x1="90%"
          y1="30%"
          x2="70%"
          y2="70%"
          stroke="url(#lineGradient2)"
          strokeWidth="1"
          strokeDasharray="5,5"
          animate={{
            strokeDashoffset: [100, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Particle effect dots */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${10 + i * 7}%`,
              top: `${15 + (i % 4) * 20}%`,
              background: allServiceIcons[i % allServiceIcons.length].color,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + (i % 3),
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Title + Subtitle */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Badge with rotating icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full mb-6 shadow-lg"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-4 h-4 text-yellow-400" />
          </motion.div>
          <span className="text-sm font-semibold text-white/90">EDIZO • Design.Develop.Deliver</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 text-white"
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 100 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="max-w-3xl mx-auto mb-8 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-white/80"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Service category icons */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-8 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { Icon: Palette, label: 'Design', color: '#f43f5e' },
            { Icon: Video, label: 'Video', color: '#f97316' },
            { Icon: Bot, label: 'AI', color: '#06b6d4' },
            { Icon: Code, label: 'Dev', color: '#22c55e' },
            { Icon: Server, label: 'API', color: '#8b5cf6' },
            { Icon: BarChart2, label: 'Marketing', color: '#ec4899' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="group flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1, y: -5 }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                y: { repeat: Infinity, duration: 2 + i * 0.2, delay: i * 0.1 },
              }}
            >
              <div
                className="w-12 h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40"
                style={{ boxShadow: `0 4px 20px ${item.color}30` }}
              >
                <item.Icon className="w-6 h-6" style={{ color: item.color }} strokeWidth={1.5} />
              </div>
              <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-[4]" />

      {/* Bottom accent lines */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] flex gap-1 justify-center">
        {['#f43f5e', '#f97316', '#06b6d4', '#22c55e', '#8b5cf6'].map((color, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full"
            style={{ backgroundColor: color, width: '60px' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PageHeader;
