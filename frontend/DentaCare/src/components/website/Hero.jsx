import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Clock } from 'lucide-react'
import gsap from 'gsap'
import { useFadeIn, useFloating } from '../../hooks/gsap'
import useT from '../../hooks/useT'
import heroImage from '../../assets/hero-dentist.jpg'

export default function Hero() {
  const t = useT()
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
    if (bgRef.current) {
      gsap.fromTo(bgRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
      )
    }
  }, [])

  // Entrance animations
  useFadeIn(tagRef, { y: -12, duration: 0.6, delay: 0.3 })
  useFadeIn(headingRef, { y: 30, duration: 0.8, delay: 0.5 })
  useFadeIn(subRef, { y: 20, duration: 0.7, delay: 0.9 })
  useFadeIn(buttonsRef, { y: 16, duration: 0.6, stagger: 0.1, delay: 1.1 })
  useFadeIn(statsRef, { y: 20, duration: 0.6, stagger: 0.08, delay: 1.2 })
  useFadeIn(imageRef, { x: 60, y: 0, duration: 1.0, delay: 0.4 }) // horizontal slide
  useFadeIn(floatRef1, { y: 20, x: -20, duration: 0.7, delay: 1.0 })
  useFadeIn(floatRef2, { y: -20, x: 20, duration: 0.7, delay: 1.1 })

  // Floating loop animations
  useFloating(floatRef1, { distance: 10, duration: 2.5, delay: 1.5 })
  useFloating(floatRef2, { distance: 8, duration: 3.0, delay: 2.0 })

  return (
    <section className="min-h-screen pt-24 flex items-center relative overflow-hidden bg-bg">
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-0">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-[#CDE9FF]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-[#CDE9FF]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 mb-12">
            <div ref={tagRef} className="opacity-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-soft/30 text-primary-deep text-sm font-medium">
                ✦ {t('heroTag')}
              </span>
            </div>

            <h1 ref={headingRef} className="heading-lg text-5xl md:text-6xl lg:text-7xl font-black text-text opacity-0">
              {t('heroHeading1')}{' '}
              <span className="relative text-[#2C2C2A]">
                {t('heroHeading2')}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#CDE9FF]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
              <br />
              <div className="mt-4">{t('heroHeading3')}</div>
            </h1>

            <p ref={subRef} className="text-sub text-lg max-w-md opacity-0">
              {t('heroSub')}
            </p>

            <div ref={buttonsRef} className="flex flex-wrap gap-3">
              <Link to="/doctors" className="btn-hero inline-flex items-center gap-2 btn-primary font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg">
                {t('bookAppointment')} <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-hero inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-6 py-3 rounded-xl">
                {t('learnMore')}
              </Link>
             
            </div>

            <div ref={statsRef} className="flex flex-wrap gap-8 pt-2">
              {[
                { num: '2,500+', label: 'heroStat1' },
                { num: '12+', label: 'heroStat2' },
                { num: '98%', label: 'heroStat3' },
              ].map(({ num, label }) => (
                <div key={label} className="stat-item opacity-0">
                  <p className="text-2xl md:text-3xl font-bold text-primary-deep">{num}</p>
                  <p className="text-xs text-sub mt-1">{t(label)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div ref={imageRef} className="relative rounded-[10px] overflow-hidden aspect-4/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-gray-100">
              <img src={heroImage} alt="Dental Care"  fetchPriority="high" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-[#2C2C2A]/40 to-transparent" />
            </div>

            <div ref={floatRef1} className="absolute top-[12%] -left-[5%] lg:-left-[10%] bg-white/95 backdrop-blur-md border border-border rounded-xl p-3 min-w-40 shadow-lg opacity-0">
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

            <div ref={floatRef2} className="absolute bottom-[15%] -right-[5%] lg:-right-[10%] bg-white/95 backdrop-blur-md border border-border rounded-xl p-3 min-w-45 shadow-lg opacity-0">
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

            <div className="absolute -top-[3%] right-[5%] lg:right-[8%] bg-accent rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-md">
              <Clock size={12} className="text-primary-deep" />
              <span className="text-[10px] font-bold text-primary-deep">{t('openHours')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float">
        <span className="text-[10px] text-muted tracking-wider">{t('scroll')}</span>
        <div className="w-px h-8 bg-linear-to-b from-primary to-transparent rounded-full" />
      </div>
    </section>
  )
}