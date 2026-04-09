import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useScrollFade = (ref, {
  y        = 30,
  delay    = 0,
  duration = 0.7,
  stagger  = 0,
  start    = 'top 85%',
  selector = null,
} = {}, deps = []) => {
  useEffect(() => {
    if (!ref?.current) return
    const ctx = gsap.context(() => {
      let target
      if (selector)       target = ref.current.querySelectorAll(selector)
      else if (stagger)   target = ref.current.children
      else                target = ref.current

      if (!target || (target.length !== undefined && !target.length)) return

      gsap.fromTo(target,
        { opacity: 0, y },
        {
          opacity: 1, y: 0, duration, delay, stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: 'play none none none',
          },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, deps)
}