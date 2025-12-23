import type { Variants } from 'framer-motion';

export const fadeIn = (direction: string, delay: number): Variants => {
  return {
    hidden: {
      opacity: 0.75,
      scale: 0.99,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'tween' as const,
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};