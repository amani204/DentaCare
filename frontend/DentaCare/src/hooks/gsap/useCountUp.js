// src/hooks/gsap/useCountUp.js
// ── THE SPECIAL ONE ──
// Animates numbers counting up when scrolled into view.
// Use it in your About/Stats section — it makes the numbers feel alive
// and is one of the most impressive subtle effects on a portfolio site.
//
// Usage:
//   const { numRefs } = useCountUp([2500, 12, 98, 15], ['+', '+', '%', '+'])
//   // then in JSX: ref={el => numRefs.current[i] = el} on each number element

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useCountUp = (values = [], suffixes = []) => {
  const numRefs = useRef([])

  useEffect(() => {
    const triggers = []

    numRefs.current.forEach((el, i) => {
      if (!el) return
      const obj = { val: 0 }
      const st = gsap.to(obj, {
        val: values[i],
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (el) el.textContent = Math.round(obj.val).toLocaleString() + (suffixes[i] ?? '')
        },
      })
      triggers.push(st.scrollTrigger)
    })

    return () => triggers.forEach(t => t?.kill())
  }, [])

  return { numRefs }
}
