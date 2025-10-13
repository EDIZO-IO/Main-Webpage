// src/components/common/Logo.tsx
import React, { useEffect, useState } from 'react';
import { useGoogleEvents } from '../hooks/useGoogleEvents';
import type { CalendarEvent } from '../../types/googleEvents';
import './Logo.animations.css';

import logoIcon from '../../assets/images/logo.png';
import logoTextLight from '../../assets/images/brand-name.png';
import logoTextDark from '../../assets/images/brand-name.png';

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
}

/**
 * Floating Emoji Animations around Logo
 */
const FloatingEmojis: React.FC<{ emojis: string[]; eventType: string }> = ({ emojis, eventType }) => {
  // Positions for emojis around the logo (in degrees)
  const positions = [0, 60, 120, 180, 240, 300];
  
  return (
    <>
      {emojis.slice(0, 6).map((emoji, index) => {
        const angle = positions[index];
        const radius = 35; // Distance from center
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <div
            key={`${emoji}-${index}`}
            className="absolute text-lg pointer-events-none z-20"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animation: `float-emoji 3s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
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
 * Festival Decorations for Indian Festivals
 */
const FestivalDecorations: React.FC<{ elements: string[]; animation: string }> = ({ elements, animation }) => (
  <>
    {/* Diwali - Diya (Lamp) */}
    {elements.includes('diya') && (
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 diya-ornament z-15">
        <div className="diya-base"></div>
        <div className="diya-flame"></div>
      </div>
    )}

    {/* Rangoli Pattern */}
    {elements.includes('rangoli') && (
      <div className="absolute inset-0 rangoli-pattern pointer-events-none z-0"></div>
    )}

    {/* National Festivals - Flag */}
    {elements.includes('flag') && (
      <div className="absolute -top-2 -left-2 z-15">
        <div className="w-5 h-4 rounded-sm overflow-hidden shadow-md" style={{ animation: 'flag-wave 2s ease-in-out infinite' }}>
          <div className="h-1/3 bg-[#FF9933]"></div>
          <div className="h-1/3 bg-white flex items-center justify-center">
            <div className="w-2 h-2 border border-[#000080] rounded-full"></div>
          </div>
          <div className="h-1/3 bg-[#138808]"></div>
        </div>
      </div>
    )}

    {/* Holi - Color Splashes */}
    {elements.includes('colors') && (
      <>
        <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-pink-400 opacity-60 z-15 animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 opacity-60 z-15 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-green-400 opacity-60 z-15 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-blue-400 opacity-60 z-15 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      </>
    )}

    {/* Kites for Makar Sankranti/Pongal */}
    {elements.includes('kite') && (
      <>
        <div className="absolute -top-3 -right-2 text-xs z-15" style={{ animation: 'kite-float 4s ease-in-out infinite' }}>🪁</div>
        <div className="absolute -top-4 -left-1 text-xs z-15" style={{ animation: 'kite-float 4s ease-in-out infinite', animationDelay: '0.5s' }}>🪁</div>
      </>
    )}

    {/* Lotus for Spiritual Events */}
    {elements.includes('lotus') && (
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-lg z-15" style={{ animation: 'lotus-bloom 3s ease-in-out infinite' }}>
        🪷
      </div>
    )}

    {/* Moon for Eid/Ramadan */}
    {elements.includes('moon') && (
      <div className="absolute -top-2 -right-2 text-lg z-15" style={{ animation: 'moon-glow-pulse 3s ease-in-out infinite' }}>
        🌙
      </div>
    )}

    {/* Om Symbol */}
    {elements.includes('om') && (
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-lg z-15 text-orange-600 font-bold">
        ॐ
      </div>
    )}

    {/* Peacock Feather for Krishna */}
    {elements.includes('peacock') && (
      <div className="absolute -top-3 -right-2 text-sm z-15" style={{ animation: 'feather-sway 3s ease-in-out infinite' }}>
        🦚
      </div>
    )}
  </>
);

/**
 * Company Event Decorations
 */
const CompanyDecorations: React.FC<{ elements: string[] }> = ({ elements }) => (
  <>
    {/* Company Badge */}
    <div className="absolute -top-2 -right-2 company-badge z-20">
      <div className="company-logo-ring"></div>
    </div>
    
    {/* Trophy for Achievements */}
    {elements.includes('trophy') && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 trophy-ornament z-15">
        🏆
      </div>
    )}
    
    {/* Rocket for Product Launch */}
    {elements.includes('rocket') && (
      <div className="absolute -top-3 -right-3 rocket-ornament z-15">🚀</div>
    )}
    
    {/* Confetti for Celebrations */}
    {elements.includes('confetti') && (
      <div className="absolute inset-0 confetti-container pointer-events-none overflow-visible">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    )}
    
    {/* Stars for Success */}
    {elements.includes('stars') && (
      <>
        <div className="absolute -top-2 -left-2 star-ornament z-15">⭐</div>
        <div className="absolute -bottom-2 -right-2 star-ornament z-15">⭐</div>
      </>
    )}

    {/* Cake for Anniversary */}
    {elements.includes('cake') && (
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 cake-ornament z-15">🎂</div>
    )}

    {/* Medal for Awards */}
    {elements.includes('medal') && (
      <div className="absolute -bottom-2 -left-2 medal-ornament z-15">🥇</div>
    )}

    {/* Chart for Growth */}
    {elements.includes('chart') && (
      <div className="absolute -bottom-2 -right-2 text-sm z-15">📈</div>
    )}
  </>
);

/**
 * Special Event Decorations
 */
const SpecialDecorations: React.FC<{ elements: string[] }> = ({ elements }) => (
  <>
    {/* Heart for Special Occasions */}
    {elements.includes('heart') && (
      <>
        <div className="absolute -top-2 -right-2 text-sm z-15 animate-pulse">❤️</div>
        <div className="absolute -bottom-2 -left-2 text-sm z-15 animate-pulse" style={{ animationDelay: '0.5s' }}>💝</div>
      </>
    )}

    {/* Gift for Celebrations */}
    {elements.includes('gift') && (
      <div className="absolute -bottom-2 -right-2 text-sm z-15">🎁</div>
    )}

    {/* Balloon */}
    {elements.includes('balloon') && (
      <>
        <div className="absolute -top-3 -left-2 text-xs z-15" style={{ animation: 'balloon-float 4s ease-in-out infinite' }}>🎈</div>
        <div className="absolute -top-4 -right-1 text-xs z-15" style={{ animation: 'balloon-float 4s ease-in-out infinite', animationDelay: '0.5s' }}>🎈</div>
      </>
    )}

    {/* Music Note */}
    {elements.includes('music') && (
      <div className="absolute -top-2 -right-2 text-sm z-15" style={{ animation: 'ornament-twinkle 2s ease-in-out infinite' }}>🎵</div>
    )}
  </>
);

const Logo: React.FC<LogoProps> = ({ isScrolled = false, isFooter = false }) => {
  const logoTextSrc = isScrolled || isFooter ? logoTextDark : logoTextLight;
  const { getActiveEvent, loading } = useGoogleEvents();
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<string[]>([]);

  useEffect(() => {
    console.log('📍 Logo: checking for active event, loading:', loading);
    
    if (!loading) {
      const event = getActiveEvent();
      console.log('📍 Logo: active event:', event);
      setActiveEvent(event);

      if (event) {
        // Generate floating emojis based on event type
        const emojis = getEmojiSet(event);
        setFloatingEmojis(emojis);

        // Animations that should show particles
        const particleAnimations = [
          'color-burst', 'fireworks', 'garba-dance', 'diya-glow', 
          'product-launch', 'success-celebration', 'holi', 'new-year',
          'milestone-glow', 'victory-sparkle'
        ];
        
        const shouldShowParticles = event.eventType === 'company' || 
                                    particleAnimations.some(anim => event.animation.includes(anim));
        
        if (shouldShowParticles) {
          const particleCount = event.eventType === 'company' ? 16 : 12;
          const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
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
  }, [loading, getActiveEvent]);

  // Get emoji set based on event
  const getEmojiSet = (event: CalendarEvent): string[] => {
    const emojiSets: Record<string, string[]> = {
      // Company Events
      'product-launch': ['🚀', '⭐', '🎯', '💡', '✨', '🎊'],
      'team-anniversary': ['🎂', '🎉', '🥳', '🎈', '🎊', '✨'],
      'success-celebration': ['🏆', '🥇', '⭐', '🌟', '💫', '🎉'],
      'milestone-glow': ['🏆', '🎯', '📈', '💪', '⭐', '✨'],
      'company-foundation': ['🏢', '🎉', '🚀', '💼', '🌟', '🎊'],
      
      // Indian Festivals
      'diwali': ['🪔', '✨', '💫', '🎆', '🎇', '🌟'],
      'holi': ['🎨', '🌈', '💙', '💚', '💛', '💜'],
      'navratri': ['💃', '🥁', '🎵', '🌺', '✨', '🎊'],
      'independence-day': ['🇮🇳', '🎗️', '⭐', '✨', '🎆', '🎇'],
      'republic-day': ['🇮🇳', '🎗️', '⭐', '✨', '🎆', '🎇'],
      'pongal': ['🌾', '🥥', '☀️', '🎉', '✨', '🌺'],
      'makar-sankranti': ['🪁', '🌾', '☀️', '✨', '🎉', '🌟'],
      'janmashtami': ['🦚', '🪈', '💙', '✨', '🌟', '🎵'],
      'raksha-bandhan': ['💛', '💖', '✨', '🎀', '🌟', '💫'],
      'eid': ['🌙', '⭐', '✨', '🕌', '🎉', '💫'],
      'christmas': ['🎄', '⛄', '🎅', '🎁', '✨', '❄️'],
      'new-year': ['🎆', '🎇', '🎉', '🥳', '🍾', '✨'],
      
      // Default
      'default': [event.emoji, '✨', '🎉', '⭐', '💫', '🌟']
    };

    return emojiSets[event.animation] || emojiSets['default'];
  };

  const animationClass = activeEvent?.animation || '';
  
  console.log('🎨 Animation class being applied:', animationClass);
  console.log('🎭 Event type:', activeEvent?.eventType);
  console.log('🎪 Decor elements:', activeEvent?.decorElements);

  return (
    <div 
      className={`
        flex items-center space-x-2 md:space-x-3 
        transition-all duration-300
        ${animationClass ? 'animate-brand-pulse' : ''}
      `}
    >
      <div className="relative">
        {/* Logo Icon with Animation */}
        <div 
          className={`
            w-12 h-12 md:w-12 md:h-12 
            rounded-full 
            flex items-center justify-center 
            transition-all duration-300 
            hover:scale-110
            shadow-md
            ${animationClass}
          `}
          style={{
            background: !animationClass ? 'linear-gradient(135deg, #ef4444, #f97316)' : undefined
          }}
        >
          <img
            src={logoIcon}
            alt="Edizo Logo"
            className="w-9 h-9 md:w-9 md:h-9 object-contain relative z-10"
          />

          {/* Event Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={activeEvent?.eventType === 'company' ? 'company-particle' : 'festival-particle'}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: activeEvent?.colors?.[particle.id % activeEvent.colors.length] || '#ef4444',
                animationDelay: `${particle.delay}s`,
                '--tx': `${Math.random() * 40 - 20}px`,
                '--ty': `${Math.random() * 40 - 20}px`
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Floating Emojis around Logo */}
        {activeEvent && floatingEmojis.length > 0 && (
          <FloatingEmojis 
            emojis={floatingEmojis} 
            eventType={activeEvent.eventType}
          />
        )}
        
        {/* Render decorations based on event type */}
        {activeEvent && (
          <>
            {activeEvent.eventType === 'company' && (
              <CompanyDecorations elements={activeEvent.decorElements} />
            )}
            {activeEvent.eventType === 'festival' && (
              <FestivalDecorations 
                elements={activeEvent.decorElements} 
                animation={activeEvent.animation}
              />
            )}
            {activeEvent.eventType === 'special' && (
              <SpecialDecorations elements={activeEvent.decorElements} />
            )}
          </>
        )}
        
        {/* Event Badge with Main Emoji */}
        {activeEvent && (
          <div 
            className="event-badge"
            title={`${activeEvent.summary} - ${
              activeEvent.eventType === 'company' ? 'Company Event' : 
              activeEvent.eventType === 'special' ? 'Special Occasion' : 
              'Celebrating'
            }! 🎉`}
            aria-label={`Currently celebrating ${activeEvent.summary}`}
          >
            {activeEvent.emoji}
          </div>
        )}
      </div>

      {/* Brand Name with Synchronized Animation */}
      <div className={`${animationClass ? 'animate-brand-glow' : ''}`}>
        <img
          src={logoTextSrc}
          alt="Edizo"
          className="h-8 md:h-9 object-contain transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default Logo;
