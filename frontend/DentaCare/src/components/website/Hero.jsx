// src/components/website/Hero.jsx
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Clock, Stethoscope } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useT from '../../hooks/useT'

gsap.registerPlugin(ScrollTrigger)

// Hero Image
import heroImage from '../../assets/hero-dentist.jpg'

export default function Hero() {
  const t = useT()
  const sectionRef = useRef(null)
  const tagRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const buttonsRef = useRef(null)
  const statsRef = useRef(null)
  const imageRef = useRef(null)
  const floatRef1 = useRef(null)
  const floatRef2 = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Kill existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Reset opacities
    gsap.set([tagRef.current, headingRef.current, subRef.current, imageRef.current, floatRef1.current, floatRef2.current, bgRef.current], { opacity: 0 })
    gsap.set(buttonsRef.current?.children, { opacity: 0, y: 16 })
    gsap.set(statsRef.current?.children, { opacity: 0, y: 20 })

    // Background
    tl.fromTo(bgRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.2 }, 0
    )

    // Tag
    tl.fromTo(tagRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.6 }, 0.3
    )

    // Heading (no SplitText)
    tl.fromTo(headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }, 0.5
    )

    // Sub text
    tl.fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 }, 0.9
    )

    // Buttons
    tl.fromTo(buttonsRef.current.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.1
    )

    // Stats
    tl.fromTo(statsRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.2
    )

    // Image
    tl.fromTo(imageRef.current,
      { opacity: 0, x: 60, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 1.0 }, 0.4
    )

    // Floating cards
    tl.fromTo(floatRef1.current,
      { opacity: 0, y: 20, x: -20 },
      { opacity: 1, y: 0, x: 0, duration: 0.7 }, 1.0
    )
    tl.fromTo(floatRef2.current,
      { opacity: 0, y: -20, x: 20 },
      { opacity: 1, y: 0, x: 0, duration: 0.7 }, 1.1
    )

    // Continuous float
    gsap.to(floatRef1.current, { y: -10, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 })
    gsap.to(floatRef2.current, { y: 8, duration: 3.0, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.0 })

    return () => {
      tl.kill()
    }
  }, [t]) // Re-run when language changes

  return (
    <section ref={sectionRef} className="min-h-screen pt-20 flex items-center relative overflow-hidden bg-bg">
      {/* Soft background blobs */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-0">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-[#CDE9FF]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-[#2C2C2A]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="flex flex-col gap-6 mb-12">
            {/* Tag */}
            <div ref={tagRef} className="opacity-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-soft/30 text-primary-deep text-sm font-medium">
                ✦ {t('heroTag')}
              </span>
            </div>

            {/* Heading */}
            <h1 ref={headingRef} className="heading-lg text-5xl  md:text-6xl lg:text-7xl font-black text-text opacity-0">
              {t('heroHeading1')}{' '}
              <span className="relative italic text-[#2C2C2A] ">
                {t('heroHeading2')}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#CDE9FF]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
              <br />
              <div className='mt-4'>{t('heroHeading3')}</div>
             
            </h1>

            {/* Sub */}
            <p ref={subRef} className="text-sub text-lg max-w-md opacity-0">
              {t('heroSub')}
            </p>

            {/* Buttons */}
            <div ref={buttonsRef} className="flex flex-wrap gap-3">
              <Link to="/doctors" className="inline-flex items-center gap-2 btn-primary font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                {t('bookAppointment')} <ArrowRight size={16} />
              </Link>
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-6 py-3 rounded-xl transition-all duration-200"
              >
                {t('learnMore')}
              </a>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-8 pt-2">
              {[
                { num: '2,500+', label: 'heroStat1' },
                { num: '12+', label: 'heroStat2' },
                { num: '98%', label: 'heroStat3' },
              ].map(({ num, label }) => (
                <div key={label} className="opacity-0">
                  <p className="text-2xl md:text-3xl font-bold text-primary-deep">{num}</p>
                  <p className="text-xs text-sub mt-1">{t(label)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image + floating cards */}
          <div className="relative">
            {/* Main image */}
            <div ref={imageRef} className="relative rounded-[10px] overflow-hidden aspect-4/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-gray-100">
              <img src={heroImage} alt="Dental Care" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-[#2C2C2A]/40 to-transparent" />
            </div>

            {/* Floating card 1 */}
            <div ref={floatRef1} className="absolute top-[12%] -left-[5%] lg:-left-[10%] bg-white/95 backdrop-blur-md border border-border rounded-xl p-3 min-w-[160px] shadow-lg opacity-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary-soft flex items-center justify-center">
                  <Shield size={18} className="text-primary-deep" />
                </div>
                <div>
                  <p className="text-xs text-sub">{t('trustedBy')}</p>
                  <p className="text-sm font-bold text-text">2,500+ {t('patients')}</p>
                </div>
              </div>
            </div>

            {/* Floating card 2 */}
            <div ref={floatRef2} className="absolute bottom-[15%] -right-[5%] lg:-right-[10%] bg-white/95 backdrop-blur-md border border-border rounded-xl p-3 min-w-[180px] shadow-lg opacity-0">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
                <span className="text-xs font-semibold text-text ml-1">5.0</span>
              </div>
              <p className="text-xs text-sub">{t('testimonial')}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-5 h-5 rounded-full bg-primary-soft flex items-center justify-center text-[10px] font-bold text-primary-deep">A</div>
                <span className="text-[10px] text-sub">Amani Z. · {t('verifiedPatient')}</span>
              </div>
            </div>

            {/* Floating badge — top right */}
            <div className="absolute -top-[3%] right-[5%] lg:right-[8%] bg-accent rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-md">
              <Clock size={12} className="text-primary-deep" />
              <span className="text-[10px] font-bold text-primary-deep">{t('openHours')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float">
        <span className="text-[10px] text-muted tracking-wider">{t('scroll')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent rounded-full" />
      </div>
    </section>
  )
}