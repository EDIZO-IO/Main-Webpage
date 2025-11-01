// src/components/common/Logo.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useGoogleEvents } from '../hooks/useGoogleEvents';
import type { CalendarEvent } from '../hooks/useGoogleEvents';
import './Logo.animations.css';

import logoIcon from '../../assets/images/logo.png';
import logoTextLight from '../../assets/images/brand-name.png';
import logoTextDark from '../../assets/images/brand-name.png';

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
}

/**
 * Multiple Floating Emojis - Positioned far from logo
 */
const FloatingEmojis: React.FC<{ emojis: string[] }> = ({ emojis }) => {
  const positions = [
    { angle: 6, radius: 55 },
    { angle: 95, radius: 40 },
    { angle: 140, radius: 55 },
    { angle: 165, radius: 60 },
    { angle: 210, radius: 55 },
    { angle: 225, radius: 60 },
    { angle: 270, radius: 55 },
    { angle: 315, radius: 60 },
  ];
  
  return (
    <>
      {emojis.slice(0, 2).map((emoji, index) => {
        const { angle, radius } = positions[index];
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <div
            key={`floating-${emoji}-${index}`}
            className="absolute text-lg pointer-events-none emoji-float"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animation: `float-emoji-orbit 4s ease-in-out infinite`,
              animationDelay: `${index * 0.25}s`,
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
              zIndex: 5
            }}
          >
            {emoji}
          </div>
        );
      })}
    </>
  );
};

/**
 * Diwali Crackers Animation
 */
const DiwaliCrackers: React.FC = () => (
  <>
    {[...Array(12)].map((_, i) => (
      <div
        key={`cracker-${i}`}
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${Math.random() * 100 - 50}px), calc(-50% + ${Math.random() * 100 - 50}px))`,
          animation: `cracker-blast 2.5s ease-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
          zIndex: 3
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"></div>
      </div>
    ))}
  </>
);

/**
 * Independence/Republic Day Flags
 */
const WavingFlags: React.FC = () => (
  <>
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-5 pointer-events-none">
      <div className="relative">
        <div className="absolute w-0.5 h-16 bg-gray-700 left-0 shadow"></div>
        <div 
          className="w-11 h-8 rounded-sm overflow-hidden shadow-xl border border-gray-200"
          style={{ 
            animation: 'flag-wave-3d 2s ease-in-out infinite', 
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-1/3 bg-[#FF9933]"></div>
          <div className="h-1/3 bg-white flex items-center justify-center">
            <div className="w-2.5 h-2.5 border-2 border-[#000080] rounded-full bg-white">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1 h-1 bg-[#000080] rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="h-1/3 bg-[#138808]"></div>
        </div>
      </div>
    </div>
    {[...Array(8)].map((_, i) => (
      <div
        key={`flag-particle-${i}`}
        className="absolute w-2 h-2 rounded-full pointer-events-none"
        style={{
          left: `${20 + Math.random() * 60}%`,
          top: `${10 + Math.random() * 80}%`,
          backgroundColor: i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808',
          animation: `tricolor-particle-float 4s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
          zIndex: 3,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
    ))}
  </>
);

/**
 * Holi Colors Splash
 */
const HoliColors: React.FC = () => (
  <>
    {[...Array(10)].map((_, i) => {
      const colors = ['#FF6B9D', '#FFD93D', '#6BCB77', '#4D96FF', '#C724B1'];
      return (
        <div
          key={`holi-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${12 + Math.random() * 8}px`,
            height: `${12 + Math.random() * 8}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            opacity: 0.7,
            animation: `holi-color-splash 3s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            zIndex: 3
          }}
        />
      );
    })}
  </>
);

/**
 * Christmas Snowfall
 */
const ChristmasSnow: React.FC = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <div
        key={`snow-${i}`}
        className="absolute text-sm pointer-events-none"
        style={{
          left: `${i * 12}%`,
          top: '-20px',
          animation: `snowfall-gentle 5s linear infinite`,
          animationDelay: `${i * 0.5}s`,
          zIndex: 5
        }}
      >
        ❄️
      </div>
    ))}
  </>
);

/**
 * New Year Fireworks
 */
const NewYearFireworks: React.FC = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <div
        key={`firework-${i}`}
        className="absolute pointer-events-none"
        style={{
          left: `${30 + i * 20}%`,
          top: `${25 + i * 15}%`,
          zIndex: 5
        }}
      >
        {[...Array(12)].map((__, j) => (
          <div
            key={`spark-${j}`}
            className="absolute w-1 h-4 rounded-full bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${j * 30}deg) translateY(-20px)`,
              transformOrigin: 'bottom center',
              animation: `firework-particle-burst 2s ease-out infinite`,
              animationDelay: `${i * 0.6 + j * 0.05}s`,
            }}
          />
        ))}
      </div>
    ))}
  </>
);

/**
 * Festival Decorations Component
 */
const FestivalDecorations: React.FC<{ animation: string }> = ({ animation }) => {
  switch (animation) {
    case 'diwali':
    case 'diya-glow':
      return <DiwaliCrackers />;
    
    case 'independence-day':
    case 'republic-day':
    case 'tricolor-wave':
      return <WavingFlags />;
    
    case 'holi':
    case 'color-burst':
      return <HoliColors />;
    
    case 'christmas':
    case 'festive-snow':
      return <ChristmasSnow />;
    
    case 'new-year':
    case 'fireworks':
      return <NewYearFireworks />;
    
    default:
      return null;
  }
};

/**
 * Festival-based Outline Effect
 */
const FestivalOutlineEffect: React.FC<{ activeEvent: CalendarEvent | null }> = ({ activeEvent }) => {
  if (!activeEvent) return null;

  const getOutlineStyle = () => {
    if (!activeEvent.colors || activeEvent.colors.length === 0) {
      return { background: 'linear-gradient(135deg, #ef4444, #f97316)' };
    }
    
    const colors = activeEvent.colors;
    switch (activeEvent.animation) {
      case 'diwali':
      case 'diya-glow':
        return { 
          background: `radial-gradient(circle, ${colors[0]}, ${colors[1] || colors[0]})`,
          boxShadow: `0 0 20px ${colors[0]}60, 0 0 40px ${colors[1] || colors[0]}40`
        };
      case 'holi':
      case 'color-burst':
        return { 
          background: `conic-gradient(${colors[0]}, ${colors[1] || colors[0]}, ${colors[2] || colors[0]}, ${colors[0]})`,
          boxShadow: `0 0 15px ${colors[0]}40, 0 0 30px ${colors[2] || colors[0]}30`
        };
      case 'independence-day':
      case 'republic-day':
      case 'tricolor-wave':
        return { 
          background: `conic-gradient(#FF9933, #FFFFFF, #138808, #FF9933)`,
          boxShadow: '0 0 15px #FF993340, 0 0 30px #13880830'
        };
      case 'new-year':
      case 'fireworks':
        return { 
          background: `radial-gradient(circle, ${colors[0]}, ${colors[1] || colors[0]}, ${colors[2] || colors[0]})`,
          boxShadow: `0 0 25px ${colors[0]}60, 0 0 40px ${colors[2] || colors[0]}40`
        };
      case 'christmas':
      case 'festive-snow':
        return { 
          background: `linear-gradient(135deg, #DC143C, #006400, #FFD700)`,
          boxShadow: '0 0 15px #DC143C40, 0 0 30px #00640030'
        };
      default:
        return { 
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`,
          boxShadow: `0 0 15px ${colors[0]}40, 0 0 30px ${colors[1] || colors[0]}30`
        };
    }
  };

  return (
    <div 
      className="absolute inset-0 rounded-full z-0"
      style={{
        ...getOutlineStyle(),
        animation: activeEvent.animation === 'holi' || activeEvent.animation === 'color-burst' 
          ? 'holi-gradient 3s ease-in-out infinite' 
          : activeEvent.animation === 'independence-day' || activeEvent.animation === 'republic-day' 
            ? 'tricolor-wave 2s ease-in-out infinite' 
            : activeEvent.animation === 'diwali' || activeEvent.animation === 'diya-glow'
              ? 'diya-ring 2s ease-in-out infinite'
              : activeEvent.animation === 'christmas' || activeEvent.animation === 'festive-snow'
                ? 'christmas-snow 3s ease-in-out infinite'
                : activeEvent.animation === 'new-year' || activeEvent.animation === 'fireworks'
                  ? 'new-year-fireworks 3s ease-in-out infinite'
                  : 'logo-pulse 3s ease-in-out infinite',
        opacity: 0.3,
        transform: 'scale(1.1)',
        zIndex: 0
      }}
    />
  );
};

/**
 * Main Logo Component
 */
const Logo: React.FC<LogoProps> = ({ isScrolled = false, isFooter = false }) => {
  const { getActiveEvent, loading } = useGoogleEvents();
  // Use useMemo to get the active event and prevent new object creation on every render
  const activeEvent = useMemo(() => getActiveEvent(), [getActiveEvent]);

  const [localActiveEvent, setLocalActiveEvent] = useState<CalendarEvent | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<string[]>([]);

  // Memoize parseEmojis function
  const parseEmojis = useMemo(() => (event: CalendarEvent): string[] => {
    const emojiSets: Record<string, string[]> = {
      'product-launch': ['🚀', '⭐', '🎯', '💡', '✨', '🎊', '💫', '🌟'],
      'team-anniversary': ['🎂', '🎉', '🥳', '🎈', '🎊', '✨', '💝', '🎁'],
      'diwali': ['🪔', '✨', '💫', '🎆', '🎇', '🌟', '🎊', '💥'],
      'holi': ['🎨', '🌈', '💙', '💚', '💛', '💜', '🎉', '✨'],
      'navratri': ['💃', '🥁', '🎵', '🌺', '✨', '🎊', '🪷', '🎉'],
      'independence-day': ['🇮🇳', '🎗️', '⭐', '✨', '🎆', '🎇', '🎉', '💫'],
      'republic-day': ['🇮🇳', '🎗️', '⭐', '✨', '🎆', '🎇', '🎉', '💫'],
      'christmas': ['🎄', '⛄', '🎅', '🎁', '✨', '❄️', '🌟', '🎉'],
      'new-year': ['🎆', '🎇', '🎉', '🥳', '🍾', '✨', '💫', '🌟'],
      'default': [event.emoji, '✨', '🎉', '⭐', '💫', '🌟']
    };

    if (event.decorElements && event.decorElements.length > 0) {
      const emojiMap: Record<string, string> = {
        'diya': '🪔', 'flag': '🇮🇳', 'colors': '🎨', 'kite': '🪁',
        'lotus': '🪷', 'moon': '🌙', 'star': '⭐', 'om': 'ॐ',
        'peacock': '🦚', 'rakhi': '💛', 'tree': '🎄', 'fireworks': '🎆',
        'coconut': '🥥', 'sugarcane': '🌾', 'bonfire': '🔥', 'heart': '❤️',
        'gift': '🎁', 'balloon': '🎈', 'rocket': '🚀', 'trophy': '🏆',
        'cake': '🎂', 'confetti': '🎊', 'dandia': '🥢', 'music': '🎵'
      };

      const customEmojis = event.decorElements
        .map(elem => emojiMap[elem] || '')
        .filter(e => e);
      
      if (customEmojis.length > 0) {
        return [...new Set([event.emoji, ...customEmojis, '✨', '💫'])].slice(0, 8);
      }
    }

    return emojiSets[event.animation] || emojiSets['default'];
  }, []); // No dependencies, function is stable

  useEffect(() => {
    // Only update state if the global activeEvent has changed and loading is false
    if (!loading && activeEvent !== localActiveEvent) {
      setLocalActiveEvent(activeEvent);

      if (activeEvent) {
        const emojis = parseEmojis(activeEvent);
        setFloatingEmojis(emojis);

        const particleAnimations = [
          'color-burst', 'fireworks', 'garba-dance', 'diya-glow', 
          'product-launch', 'success-celebration', 'holi', 'new-year',
          'milestone-glow', 'victory-sparkle'
        ];
        
        const shouldShowParticles = activeEvent.eventType === 'company' || 
                                    particleAnimations.some(anim => activeEvent.animation.includes(anim));
        
        if (shouldShowParticles) {
          const particleCount = activeEvent.eventType === 'company' ? 10 : 8;
          const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            delay: Math.random() * 2
          }));
          setParticles(newParticles);
        } else {
          setParticles([]);
        }
      } else {
        setFloatingEmojis([]);
        setParticles([]);
      }
    }
  }, [activeEvent, localActiveEvent, loading, parseEmojis]); // Add parseEmojis to dependencies

  // Get colors for text
  const getTextColors = () => {
    if (!localActiveEvent || !localActiveEvent.colors || localActiveEvent.colors.length === 0) {
      return ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'];
    }
    return localActiveEvent.colors;
  };

  const textColors = getTextColors();
  const logoTextSrc = isScrolled || isFooter ? logoTextDark : logoTextLight;

  return (
    <div className="flex items-center gap-3 md:gap-4 transition-all duration-300">
      {/* Logo Icon Container - Fixed size, always visible */}
      <div className="relative" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
        {/* Glow ring for events */}
        {localActiveEvent && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${textColors[0]}15 0%, transparent 70%)`,
              transform: 'scale(1.3)',
              zIndex: 0
            }}
          />
        )}

        {/* Festival-based Outline Effect */}
        {localActiveEvent && <FestivalOutlineEffect activeEvent={localActiveEvent} />}

        {/* Main Logo Circle with White Background */}
        <div 
          className={`
            w-12 h-12 md:w-13 md:h-13 rounded-full 
            flex items-center justify-center 
            transition-all duration-500
            hover:scale-110 shadow-lg
            relative z-10
            ${localActiveEvent?.animation || ''}
          `}
          style={{
            background: 'white',
            animation: localActiveEvent ? 'logo-pulse 3s ease-in-out infinite' : 'none'
          }}
        >
          <img
            src={logoIcon}
            alt="Edizo Logo"
            className="w-9 h-9 md:w-10 md:h-10 object-contain relative z-20"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              animation: localActiveEvent ? 'logo-icon-bounce 2s ease-in-out infinite' : 'none'
            }}
          />

          {/* Event Particles - INSIDE circle only */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '4px',
                height: '4px',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: textColors[particle.id % textColors.length],
                animation: `particle-gentle-float 3s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                opacity: 0.6,
                zIndex: 2,
              }}
            />
          ))}
        </div>

        {/* Floating Emojis - FAR OUTSIDE logo area */}
        {localActiveEvent && floatingEmojis.length > 0 && (
          <FloatingEmojis emojis={floatingEmojis} />
        )}
        
        {/* Festival Decorations - OUTSIDE logo area */}
        {localActiveEvent && (
          <FestivalDecorations animation={localActiveEvent.animation} />
        )}
        
        {/* Main Event Badge - top-right corner ONLY */}
        {localActiveEvent && (
          <div 
            className="absolute -top-2 -right-2 rounded-full w-7 h-7 flex items-center justify-center shadow-lg z-30 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${textColors[0]}, ${textColors[1] || textColors[0]})`,
              animation: 'badge-pulse-glow 2s ease-in-out infinite',
              fontSize: '16px',
              border: '2px solid white'
            }}
            title={localActiveEvent.summary}
          >
            {localActiveEvent.emoji}
          </div>
        )}
      </div>

      {/* Brand Name - Image when no event, Animated Text when event active */}
      {localActiveEvent ? (
        // Animated Text for Active Events with Festival Effects
        <div className="relative flex items-center gap-0.5">
          {['E', 'D', 'I', 'Z', 'O'].map((letter, index) => (
            <span
              key={`letter-${index}`}
              className="font-bold text-2xl md:text-3xl transition-all duration-500 logo-letter-active"
              style={{
                fontFamily: '"Product Sans", "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '-0.02em',
                color: textColors[index % textColors.length],
                animation: `letter-bounce-smooth 1.2s ease-in-out ${index * 0.1}s infinite`,
                display: 'inline-block',
                textShadow: `0 2px 8px ${textColors[index % textColors.length]}40`,
                transform: 'translateZ(0)',
                willChange: 'transform',
                zIndex: 20,
                // Apply festival-specific text effects
                animationName: localActiveEvent.animation === 'diwali' || localActiveEvent.animation === 'diya-glow'
                  ? 'diya-text-effect'
                  : localActiveEvent.animation === 'holi' || localActiveEvent.animation === 'color-burst'
                    ? 'holi-text-effect'
                    : 'festival-text-glow',
                animationDuration: '2s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out'
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      ) : (
        // Brand Name Image when No Event
        <div className="relative z-20 transition-opacity duration-500">
          <img
            src={logoTextSrc}
            alt="Edizo"
            className="h-8 md:h-9 object-contain transition-all duration-300"
            style={{
              filter: isScrolled || isFooter 
                ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' 
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Logo;