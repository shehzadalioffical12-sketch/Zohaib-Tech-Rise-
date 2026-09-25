import React from 'react';
import { useLms } from '../../context/LmsContext';

interface LogoProps {
  variant?: 'full' | 'compact' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', size = 'md' }) => {
  const { settings } = useLms();

  const isWhite = variant === 'white';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon matching official ZTR arrow + graduation cap logo mark */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Graduation Cap atop the T */}
          <polygon points="62,6 94,18 62,28 30,18" fill={isWhite ? '#93c5fd' : '#0F2744'} />
          <path d="M44,23 L44,34 C44,38 80,38 80,34 L80,23" stroke={isWhite ? '#93c5fd' : '#0F2744'} strokeWidth="2.5" fill="none" />
          <line x1="90" y1="20" x2="93" y2="35" stroke="#0284c7" strokeWidth="2" />
          <circle cx="93" cy="36" r="2" fill="#0284c7" />

          {/* Letter T (Dark Navy / Slate) */}
          <path d="M50,30 L74,30 L74,38 L65,38 L65,85 L59,85 L59,38 L50,38 Z" fill={isWhite ? '#cbd5e1' : '#0F2744'} />

          {/* Letter R (Dark Navy / Slate) */}
          <path d="M72,30 L88,30 C96,30 100,34 100,42 C100,48 96,52 90,53 L101,85 L92,85 L82,55 L78,55 L78,85 L72,85 Z M78,36 L78,49 L87,49 C91,49 93,47 93,42 C93,38 91,36 87,36 Z" fill={isWhite ? '#cbd5e1' : '#0F2744'} />

          {/* Letter Z (Electric Blue gradient shape) */}
          <path d="M12,30 L45,30 L45,38 L25,76 L48,76 L48,85 L12,85 L12,77 L32,38 L12,38 Z" fill="url(#zBlueGrad)" />

          {/* Upward dynamic swoosh / Arrow slicing up */}
          <path d="M8,68 C22,78 44,70 65,52 C84,36 94,22 108,12" stroke="url(#arrowGrad)" strokeWidth="6" strokeLinecap="round" />
          <polygon points="106,6 116,11 110,21" fill="#0284c7" />

          <defs>
            <linearGradient id="zBlueGrad" x1="12" y1="30" x2="48" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="arrowGrad" x1="8" y1="70" x2="114" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {variant !== 'compact' && (
        <div className="flex flex-col leading-tight">
          <div className={`font-extrabold tracking-tight ${titleSizes[size]} ${isWhite ? 'text-white' : 'text-slate-900'}`}>
            <span>Zohaib </span>
            <span className="text-sky-500">Tech Rise</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-semibold tracking-wider uppercase text-sky-400">
            <span className="w-2 h-px bg-sky-400/50"></span>
            <span>L M S</span>
            <span className="w-2 h-px bg-sky-400/50"></span>
          </div>
          <div className={`text-[9px] font-medium tracking-tight truncate max-w-[200px] ${isWhite ? 'text-slate-400' : 'text-slate-500'}`}>
            {settings.tagline || 'Learn Today. Innovate Tomorrow.'}
          </div>
        </div>
      )}
    </div>
  );
};
