// src/hooks/gsap/useFloating.js
// Infinite idle bob loop — use for hero floating cards/badges only.
// Starts after the entrance animation finishes (delay).
//
// useFloating(ref)
// useFloating(ref, { distance: 10, duration: 2.5, delay: 1.5 })

import { useEffect } from 'react'
import gsap from 'gsap'

export const useFloating = (ref, {
  distance = 8,
  duration = 2.5,
  delay    = 1.2,
} = {}) => {
  useEffect(() => {
    if (!ref?.current) return
    const tween = gsap.to(ref.current, {
      y: -distance,
      duration,
      delay,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    return () => tween.kill()
  }, [])
}
