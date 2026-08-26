'use client';

import React, { createContext, useContext } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion';

const FadeInStaggerContext = createContext(false);

export interface FadeInProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
  fullWidth?: boolean;
}

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.45,
  distance = 24,
  once = true,
  amount = 0.2,
  fullWidth = false,
  className = '',
  ...props
}: FadeInProps) {
  const isReducedMotion = useReducedMotion();
  const isInStaggerGroup = useContext(FadeInStaggerContext);

  const getOffset = () => {
    if (isReducedMotion) return { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: isReducedMotion ? 0 : duration,
        delay: isInStaggerGroup ? 0 : delay,
        ease: 'easeOut',
      },
    },
  };

  if (isInStaggerGroup) {
    return (
      <motion.div
        variants={variants}
        className={`${fullWidth ? 'w-full' : ''} ${className}`.trim()}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      className={`${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface FadeInStaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
  className?: string;
}

export function FadeInStagger({
  children,
  stagger = 0.08,
  delayChildren = 0,
  once = true,
  amount = 0.15,
  className = '',
  ...props
}: FadeInStaggerProps) {
  const isReducedMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isReducedMotion ? 0 : stagger,
        delayChildren: isReducedMotion ? 0 : delayChildren,
      },
    },
  };

  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={variants}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </FadeInStaggerContext.Provider>
  );
}
