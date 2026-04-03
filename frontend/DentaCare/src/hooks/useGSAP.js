// src/hooks/useGSAP.js
// Central GSAP animation utilities
// Usage: import { useScrollReveal, useHeroAnim, useSplitText } from '../hooks/useGSAP'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// ── Fade up on scroll (most common)
export function useScrollReveal(selector, options = {}) {
  useEffect(() => {
    const elements = gsap.utils.toArray(selector)
    if (!elements.length) return

    elements.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: options.y ?? 40 },
        {
          opacity: 1, y: 0,
          duration: options.duration ?? 0.8,
          delay: (options.stagger ?? 0.12) * i,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
}

// ── Staggered children animation
export function useStagger(containerRef, childSelector, options = {}) {
  useEffect(() => {
    if (!containerRef.current) return

    const children = containerRef.current.querySelectorAll(childSelector)
    if (!children.length) return

    gsap.fromTo(children,
      { opacity: 0, y: options.y ?? 50 },
      {
        opacity: 1, y: 0,
        duration: options.duration ?? 0.7,
        stagger: options.stagger ?? 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: options.start ?? 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
}

// ── Split text word-by-word animation
export function useSplitReveal(elementRef, options = {}) {
  useEffect(() => {
    if (!elementRef.current) return

    let split
    try {
      split = new SplitText(elementRef.current, { type: 'words,chars' })

      gsap.fromTo(split.words,
        { opacity: 0, y: options.y ?? 30 },
        {
          opacity: 1, y: 0,
          duration: options.duration ?? 0.6,
          stagger: options.stagger ?? 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elementRef.current,
            start: options.start ?? 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )
    } catch {
      // SplitText not available — fallback to simple fade
      gsap.fromTo(elementRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: elementRef.current, start: 'top 85%' }
        }
      )
    }

    return () => {
      if (split) split.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}

// ── Hero entrance (no scroll trigger — fires immediately)
export function useHeroEntrance(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    const els = containerRef.current.querySelectorAll('[data-hero]')

    tl.fromTo(els,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }
    )

    return () => tl.kill()
  }, [])
}

// ── Horizontal slide on scroll
export function useSlideIn(elementRef, direction = 'left', options = {}) {
  useEffect(() => {
    if (!elementRef.current) return

    const xFrom = direction === 'left' ? -60 : 60

    gsap.fromTo(elementRef.current,
      { opacity: 0, x: xFrom },
      {
        opacity: 1, x: 0,
        duration: options.duration ?? 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: options.start ?? 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
}

// ── Counter animation
export function useCounter(elementRef, endValue, options = {}) {
  useEffect(() => {
    if (!elementRef.current) return

    const obj = { val: 0 }
    gsap.to(obj, {
      val: endValue,
      duration: options.duration ?? 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (elementRef.current) {
          elementRef.current.textContent = Math.round(obj.val).toLocaleString() + (options.suffix ?? '')
        }
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [endValue])
}

// ── Scale + fade on scroll
export function useScaleReveal(elementRef, options = {}) {
  useEffect(() => {
    if (!elementRef.current) return

    gsap.fromTo(elementRef.current,
      { opacity: 0, scale: options.from ?? 0.92 },
      {
        opacity: 1, scale: 1,
        duration: options.duration ?? 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: options.start ?? 'top 82%',
          toggleActions: 'play none none none',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
}

// ── Parallax background
export function useParallax(elementRef, speed = 0.3) {
  useEffect(() => {
    if (!elementRef.current) return

    gsap.to(elementRef.current, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
}

export default gsap
