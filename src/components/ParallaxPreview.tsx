"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Gives a card preview a few pixels of scroll drift: the inner layer moves
 * slower than the card, so it slides opposite to scroll direction. The moving
 * layer is oversized (scale 1.12) so the drift never exposes its edges.
 * Static under reduced motion.
 */
export default function ParallaxPreview({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const y = useSpring(drift, { stiffness: 90, damping: 28 });

  // Ref stays attached so useScroll always has its measurement target.
  if (reduce) {
    return (
      <div ref={ref} className={`absolute inset-0 ${className ?? ""}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`absolute inset-0 ${className ?? ""}`}>
      <motion.div style={{ y, scale: 1.12 }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}
