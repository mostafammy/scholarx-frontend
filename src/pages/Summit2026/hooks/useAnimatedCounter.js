/**
 * @fileoverview useAnimatedCounter — scroll-triggered animated number counter.
 * Single Responsibility: ONLY manages IntersectionObserver + easing animation.
 * Uses requestAnimationFrame for smooth 60fps counting without jitter.
 *
 * @module useAnimatedCounter
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Easing function: ease-out cubic — fast start, slow finish.
 * @param {number} t - progress [0..1]
 * @returns {number}
 */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Custom hook that animates a number from 0 to `target` when the
 * attached ref element enters the viewport.
 *
 * @param {number} target - The final number to count to
 * @param {number} [duration=2000] - Animation duration in milliseconds
 * @param {number} [threshold=0.3] - IntersectionObserver threshold
 * @returns {{ count: number, ref: React.RefObject<HTMLElement> }}
 *
 * @example
 * const { count, ref } = useAnimatedCounter(1200, 2000);
 * return <div ref={ref}>{count}+</div>;
 */
export const useAnimatedCounter = (target, duration = 2000, threshold = 0.3) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const frameRef = useRef(null);

  const runAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setCount(target); // ensure exact final value
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.unobserve(element); // fire once only
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [runAnimation, threshold]);

  return { count, ref };
};
