import { useRef, useEffect } from 'react';
import { CheckCircle, Award, Heart, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '../../hooks/useGSAP';
import useT from '../../hooks/useT';
import Navbar from '../../components/website/Navbar';
import Footer from '../../components/website/Footer';
import aboutImage from '../../assets/about-dentist.jpg';

const VALUES = [
  { icon: Heart, titleKey: 'value1Title', descKey: 'value1Desc' },
  { icon: Award, titleKey: 'value2Title', descKey: 'value2Desc' },
  { icon: Users, titleKey: 'value3Title', descKey: 'value3Desc' },
  { icon: CheckCircle, titleKey: 'value4Title', descKey: 'value4Desc' },
];

export default function AboutPage() {
  const t = useT();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const cardsRef = useRef(null);
  const imageRef = useRef(null);
  const numberRefs = useRef([]);

  // Entrance animations
  useGsap({
    leftText: {
      ref: leftRef,
      from: { opacity: 0, x: -50 },
      to: { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
      scrollTrigger: { trigger: '#about-left', start: 'top 80%' },
    },
    rightImage: {
      ref: rightRef,
      from: { opacity: 0, x: 50 },
      to: { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
      scrollTrigger: { trigger: '#about-right', start: 'top 80%' },
    },
    imageClip: {
      ref: imageRef,
      from: { clipPath: 'inset(0 100% 0 0)' },
      to: { clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power3.inOut' },
      scrollTrigger: { trigger: '#about-image', start: 'top 75%' },
    },
    valueCards: {
      selector: '.value-card',
      from: { opacity: 0, y: 30 },
      to: { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
      scrollTrigger: { trigger: '#value-cards', start: 'top 80%' },
    },
  }, []);

  
  useEffect(() => {
    const values = [2500, 12, 98, 15];
    const suffixes = ['+', '+', '%', '+'];

    numberRefs.current.forEach((el, i) => {
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: values[i],
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (el) el.textContent = Math.round(obj.val).toLocaleString() + suffixes[i];
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-12">
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            {/* Top: text + image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div ref={leftRef} id="about-left" className="opacity-0">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-accent-soft uppercase tracking-wider bg-accent-soft/10 px-3 py-1 rounded-full">
                    {t('aboutTag')}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
                  {t('aboutHeading1')}{' '}
                  <span className="text-primary-deep">{t('aboutHeading2')}</span>
                </h2>
                <p className="text-lg text-sub mb-6 leading-relaxed">{t('aboutText1')}</p>
                <p className="text-sub mb-8 leading-relaxed">{t('aboutText2')}</p>
                <div className="flex flex-wrap gap-2">
                  {['aboutTag1', 'aboutTag2', 'aboutTag3', 'aboutTag4'].map((tagKey) => (
                    <span
                      key={tagKey}
                      className="text-xs font-medium text-primary bg-primary-soft/50 px-3 py-1.5 rounded-full"
                    >
                      ✓ {t(tagKey)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — image with overlay */}
              <div ref={rightRef} id="about-right" className="relative opacity-0">
                <div id="about-image" ref={imageRef} className="rounded-[10px] overflow-hidden aspect-4/5 shadow-2xl">
                  <img src={aboutImage} alt="Dental Clinic" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-accent rounded-xl p-4 shadow-lg">
                  <p className="text-3xl font-bold text-primary-deep">15+</p>
                  <p className="text-xs font-semibold text-primary-deep">{t('yearsExcellence')}</p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border mb-20">
              {[
                { labelKey: 'statHappyPatients' },
                { labelKey: 'statExpertDoctors' },
                { labelKey: 'statSatisfaction' },
                { labelKey: 'statYearsExperience' },
              ].map(({ labelKey }, i) => (
                <div key={labelKey} className="bg-white p-6 text-center">
                  <p ref={(el) => (numberRefs.current[i] = el)} className="text-3xl md:text-4xl font-bold text-primary-deep">
                    0
                  </p>
                  <p className="text-sm text-sub mt-1">{t(labelKey)}</p>
                </div>
              ))}
            </div>

            {/* Value cards */}
            <div ref={cardsRef} id="value-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map(({ icon: Icon, titleKey, descKey }) => (
                <div
                  key={titleKey}
                  className="value-card opacity-0 bg-bg border border-border rounded-xl p-6 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                    <Icon size={22} className="text-primary-deep" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">{t(titleKey)}</h3>
                  <p className="text-sm text-sub leading-relaxed">{t(descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}