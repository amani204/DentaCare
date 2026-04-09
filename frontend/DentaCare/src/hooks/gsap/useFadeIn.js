
import { useEffect } from 'react'
import gsap from 'gsap'

export const useFadeIn = (ref, {
  y        = 20,
  x        = 0,
  scale    = 1,
  delay    = 0,
  duration = 0.7,
  stagger  = 0,
  ease     = 'power3.out',
} = {}) => {
  useEffect(() => {
    if (!ref?.current) return
    const ctx = gsap.context(() => {
      const target = stagger ? ref.current.children : ref.current
      gsap.fromTo(target,
        { opacity: 0, y, x, scale },
        { opacity: 1, y: 0, x: 0, scale: 1, duration, delay, stagger, ease }
      )
    }, ref)
    return () => ctx.revert()
  }, [])
}