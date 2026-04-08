
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsap(animations, deps = []) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        Object.entries(animations).forEach(([key, config]) => {
          const { ref, selector, from, to, scrollTrigger, loop = false } = config;
          
          let targets = [];
          if (selector) {
            targets = document.querySelectorAll(selector);
          } else if (ref?.current) {
            targets = [ref.current];
          }
          if (!targets.length) return;

          if (loop) {
            gsap.fromTo(targets, from, { ...to, repeat: -1, yoyo: true });
          } else {
            const tl = gsap.timeline(
              scrollTrigger ? { scrollTrigger: { ...scrollTrigger, toggleActions: 'play none none none' } } : {}
            );
            tl.fromTo(targets, from, to);
          }
        });
      });
      
      ScrollTrigger.refresh();
      
      return () => ctx.revert();
    }, 50);
    
    return () => clearTimeout(timer);
  }, deps);
}