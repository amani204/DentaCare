import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Calendar, CreditCard } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollFade } from '../../hooks/gsap';
import useT from '../../hooks/useT';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { icon: Calendar, step: '01', titleKey: 'step1Title', descKey: 'step1Desc' },
  { icon: Phone, step: '02', titleKey: 'step2Title', descKey: 'step2Desc' },
  { icon: CreditCard, step: '03', titleKey: 'step3Title', descKey: 'step3Desc' },
];

export default function BookingCTA() {
  const t = useT();
  const contentRef = useRef(null);
  const stepsRef = useRef(null);
  const bgRef = useRef(null);

  // Parallax background 
  useEffect(() => {
    if (!bgRef.current) return;
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  // Scroll‑triggered fade‑up for content and steps
  useScrollFade(contentRef, { y: 40, duration: 1, start: 'top 80%' });
  useScrollFade(stepsRef, { selector: '.step-item', y: 40, stagger: 0.15, start: 'top 80%' });

  return (
    <>
      {/* How it works */}
      <section id="contact" className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-4">
              <span className="text-xs font-semibold text-accent-soft uppercase tracking-wider bg-accent-soft/10 px-3 py-1 rounded-full">
                {t('bookingTag')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
              {t('bookingHeading1')}{' '}
              <span className="text-primary-deep">{t('bookingHeading2')}</span>
            </h2>
          </div>

          <div
            ref={stepsRef}
            id="steps-container"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-linear-to-r from-primary-soft via-primary to-primary-soft" />

            {STEPS.map(({ icon: Icon, step, titleKey, descKey }) => (
              <div key={step} className="step-item opacity-0 text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-primary flex items-center justify-center mx-auto mb-5 shadow-md relative">
                  <Icon size={28} className="text-primary-deep" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-primary-deep">
                    {step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">{t(titleKey)}</h3>
                <p className="text-sub leading-relaxed max-w-xs mx-auto">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA banner */}
      <section className="relative overflow-hidden bg-primary-deep py-16 md:py-20">
        <div
          ref={bgRef}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          ref={contentRef}
          id="cta-content"
          className="relative z-10 max-w-7xl mx-auto px-6 opacity-0"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-lg text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {t('ctaHeading1')}{' '}
              <span className="text-white">{t('ctaHeading2')}</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8">
              {t('ctaText')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 px-8 py-3 btn-primary"
              >
                {t('bookAppointment')} <ArrowRight size={18} />
              </Link>
              <a
                href="tel:+213000000000"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white/70 font-semibold px-8 py-3 rounded-[10px] transition-all duration-200 hover:bg-white/30"
              >
                <Phone size={18} /> {t('callNow')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}