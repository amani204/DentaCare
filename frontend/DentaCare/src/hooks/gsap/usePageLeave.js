// src/hooks/gsap/usePageLeave.js
// Fade out a page/element before navigating away.
// Returns a leaveAndGo() function — call it instead of navigate() directly.
//
// const { leaveAndGo } = usePageLeave(pageRef)
// leaveAndGo(() => navigate('/doctors/123'))

import gsap from 'gsap'

export const usePageLeave = (ref) => {
  const leaveAndGo = (onComplete) => {
    if (!ref?.current) { onComplete(); return }
    gsap.to(ref.current, {
      opacity: 0,
      y: 16,
      duration: 0.3,
      ease: 'power2.in',
      onComplete,
    })
  }
  return { leaveAndGo }
}
