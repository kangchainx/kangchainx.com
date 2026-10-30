'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SocialIconProps {
  children: React.ReactNode;
  href: string;
  title: string;
  className?: string;
}

// Monochrome by design: brand colors would break the single-accent palette.
export const SocialIcon = ({ children, href, title, className }: SocialIconProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      title={title}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted hover:text-foreground hover:border-accent transition-colors duration-200",
        className,
      )}
    >
      {children}
    </a>
  );
};
