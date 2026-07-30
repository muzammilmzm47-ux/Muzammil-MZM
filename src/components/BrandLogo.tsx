import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showIcon?: boolean;
  lightMode?: boolean;
  variant?: 'vertical' | 'horizontal';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  showIcon = false,
  lightMode = false,
  variant = 'vertical',
}) => {
  // Sizing definitions for icon and text
  const iconSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-32',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base tracking-[0.25em]',
    md: 'text-lg sm:text-xl md:text-2xl tracking-[0.3em]',
    lg: 'text-2xl sm:text-3xl md:text-4xl tracking-[0.35em]',
    xl: 'text-4xl sm:text-5xl md:text-6xl tracking-[0.4em]',
  };

  const subSizes = {
    sm: 'text-[7px] tracking-[0.3em]',
    md: 'text-[8px] sm:text-[9.5px] tracking-[0.38em]',
    lg: 'text-[10px] sm:text-[12px] tracking-[0.42em]',
    xl: 'text-[13px] sm:text-[15px] tracking-[0.48em]',
  };

  return (
    <div className={`inline-flex ${variant === 'horizontal' ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center'} ${className}`}>
      {/* Coat Hanger Vector Logo (optional) */}
      {showIcon && (
        <svg
          viewBox="0 0 260 170"
          className={`${iconSizes[size]} w-auto drop-shadow-lg transition-transform duration-300 hover:scale-105 shrink-0`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Gold Gradient */}
            <linearGradient id="trednyGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7E298" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="60%" stopColor="#9B752A" />
              <stop offset="85%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#E6C65C" />
            </linearGradient>

            <linearGradient id="trednyGoldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#B38A36" />
            </linearGradient>

            <filter id="logoGlow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          <g filter="url(#logoGlow)">
            <path
              d="M 130,42 C 130,24 146,12 136,4 C 128,-3 115,4 117,18 C 119,25 127,31 130,42 Z"
              fill="url(#trednyGoldHighlight)"
            />
            <path
              d="M 135,12 C 131,7 122,9 123,16 C 124,21 129,26 130,34"
              stroke="url(#trednyGoldMain)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 130,42 C 112,53 72,68 46,80 C 38,84 42,92 50,89 C 72,82 108,70 130,58 C 152,70 188,82 210,89 C 218,92 222,84 214,80 C 188,68 148,53 130,42 Z"
              fill="url(#trednyGoldMain)"
            />
          </g>
        </svg>
      )}

      {/* Brand Typography "TREDNY" */}
      <div className={`${variant === 'horizontal' ? 'text-left' : 'text-center'} whitespace-nowrap`}>
        <div className="flex items-center justify-center font-fashion font-bold uppercase tracking-[0.25em] leading-none whitespace-nowrap">
          <span
            className={`${textSizes[size]} whitespace-nowrap select-none`}
            style={{
              backgroundImage: 'linear-gradient(135deg, #FFF5CC 0%, #F1D592 30%, #C5A059 60%, #9E7A27 85%, #F7E298 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
            }}
          >
            TREDNY
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`block font-sans font-medium uppercase mt-1 tracking-[0.42em] ${subSizes[size]} whitespace-nowrap text-white opacity-95`}
          >
            BRAND
          </span>
        )}
      </div>
    </div>
  );
};

