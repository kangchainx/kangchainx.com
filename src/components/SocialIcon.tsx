'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SocialIconProps {
  children: React.ReactNode;
  href: string;
  title: string;
  brandColor?: string;
  className?: string;
}

export const SocialIcon = ({ 
  children, 
  href, 
  title, 
  brandColor = '#3b82f6',
  className 
}: SocialIconProps) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn("group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 opacity-80 hover:opacity-100 shadow-sm hover:shadow-lg hover:-translate-y-1", className)}
      style={{ backgroundColor: brandColor }}
    >
      {/* Tooltip - Native CSS */}
      <div 
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-zinc-900 border border-white/10 rounded-lg pointer-events-none z-50 shadow-2xl transition-all duration-300 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <span className="text-[10px] font-bold text-white whitespace-nowrap tracking-widest uppercase">
          {title}
        </span>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-l border-t border-white/10 rotate-45"></div>
      </div>

      {/* Icon - Native CSS */}
      <div className="text-white flex items-center justify-center">
        {children}
      </div>
    </a>
  );
};
