'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div';
}

export function Section({ children, className, id, as = 'section' }: SectionProps) {
  const reduce = useReducedMotion();
  const MotionTag = as === 'section' ? motion.section : motion.div;

  return (
    <MotionTag
      id={id}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('py-16 md:py-24', className)}
    >
      {children}
    </MotionTag>
  );
}
