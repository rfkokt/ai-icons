"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<HTMLElement>(null);

  const {
    y = 80,
    opacity = 0,
    duration = 0.7,
    stagger = 0.1,
    ease = "back.out(1.2)",
    start = "top 80%",
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    gsap.from(ref.current.children, {
      scrollTrigger: {
        trigger: ref.current,
        start,
      },
      y,
      opacity,
      duration,
      stagger,
      ease,
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [y, opacity, duration, stagger, ease, start]);

  return ref;
}

export function useScrollAnimationFrom(
  ref: React.RefObject<HTMLElement>,
  options: ScrollAnimationOptions = {}
) {
  const {
    y = 80,
    opacity = 0,
    duration = 0.7,
    stagger = 0.1,
    ease = "back.out(1.2)",
    start = "top 80%",
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    gsap.from(ref.current.children, {
      scrollTrigger: {
        trigger: ref.current,
        start,
      },
      y,
      opacity,
      duration,
      stagger,
      ease,
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [ref, y, opacity, duration, stagger, ease, start]);
}
