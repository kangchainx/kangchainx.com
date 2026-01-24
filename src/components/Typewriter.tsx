'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  texts: string[];
  speed?: number;
  delay?: number;
  className?: string;
}

export const Typewriter = ({ 
  texts, 
  speed = 80, 
  delay = 2500,
  className 
}: TypewriterProps) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && subIndex === texts[index].length + 1) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && subIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }, 0);
    } else {
      timeout = setTimeout(() => {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      }, isDeleting ? speed / 2 : speed);
    }

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, texts, speed, delay]);

  return (
    <span className={cn("relative font-medium text-accent", className)}>
      {texts[index].substring(0, subIndex)}
      <span className="ml-1 inline-block w-[1.5px] h-[0.9em] bg-accent align-middle animate-pulse-fast"></span>
    </span>
  );
};
