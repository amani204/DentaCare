import { useRef } from 'react';
import { Stethoscope, Sparkles, Wrench, Building, Leaf, Baby } from 'lucide-react';
import { useFadeIn, useScrollFade } from '../../hooks/gsap';
import useT from '../../hooks/useT';

const SERVICES = [
  {
    icon: Stethoscope,
    number: '01',
    titleKey: 'service1Title',
    descKey: 'service1Desc',
    color: 'bg-[#D0E4FF]',
    textColor: 'text-[#091E5D]',
    featuresKeys: ['service1Feature1', 'service1Feature2', 'service1Feature3'],
  },
  {
    icon: Sparkles,
    number: '02',
    titleKey: 'service2Title',
    descKey: 'service2Desc',
    color: 'bg-[#F6FDD0]',
    textColor: 'text-[#5B6800]',
    featuresKeys: ['service2Feature1', 'service2Feature2', 'service2Feature3'],
  },
  {
    icon: Wrench,
    number: '03',
    titleKey: 'service3Title',
    descKey: 'service3Desc',
    color: 'bg-[#FEF9EE]',
    textColor: 'text-[#92400E]',
    featuresKeys: ['service3Feature1', 'service3Feature2', 'service3Feature3'],
  },
  {
    icon: Building,
    number: '04',
    titleKey: 'service4Title',
    descKey: 'service4Desc',
    color: 'bg-[#FFF0F0]',
    textColor: 'text-[#991B1B]',
    featuresKeys: ['service4Feature1', 'service4Feature2', 'service4Feature3'],
  },
  {
    icon: Leaf,
    number: '05',
    titleKey: 'service5Title',
    descKey: 'service5Desc',
    color: 'bg-[#F0FDF4]',
    textColor: 'text-[#166534]',
    featuresKeys: ['service5Feature1', 'service5Feature2', 'service5Feature3'],
  },
  {
    icon: Baby,
    number: '06',
    titleKey: 'service6Title',
    descKey: 'service6Desc',
    color: 'bg-[#EDE9FE]',
    textColor: 'text-[#5B21B6]',
    featuresKeys: ['service6Feature1', 'service6Feature2', 'service6Feature3'],
  },
];

export default function Services() {
  const t = useT();
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useFadeIn(headerRef, { y: 30, duration: 0.8 });
  useScrollFade(gridRef, { selector: '.service-card', y: 50, stagger: 0.1, start: 'top 80%', scale: 0.96 });

  return (
    <section id="services" className="py-20 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div
          ref={headerRef}
          id="services-header"
          className="text-center mb-16 opacity-0"
        >
          <div className="flex justify-center mb-4">
            <span className="text-xs font-semibold text-accent-soft uppercase tracking-wider bg-accent-soft/10 px-3 py-1 rounded-full">
              {t('servicesTag')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 max-w-2xl mx-auto">
            {t('servicesHeading1')}{' '}
            <span className="text-primary-deep">{t('servicesHeading2')}</span>
          </h2>
          <p className="text-lg text-sub max-w-xl mx-auto">
            {t('servicesSub')}
          </p>
        </div>

        <div
          ref={gridRef}
          id="services-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SERVICES.map((service) => {
            const { icon: Icon, number, titleKey, descKey, color, textColor, featuresKeys } = service;
            return (
              <div
                key={titleKey}
                className="service-card opacity-0 bg-white border border-border rounded-[10px] p-6 relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary group"
              >
                <span className="absolute top-4 right-5 text-5xl font-bold opacity-20 pointer-events-none">
                  {number}
                </span>
                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}>
                  <Icon size={24} className={textColor} />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">{t(titleKey)}</h3>
                <p className="text-sm text-sub leading-relaxed mb-4">{t(descKey)}</p>
                <div className="flex flex-col gap-1.5 mb-4">
                  {featuresKeys.map((featureKey) => (
                    <div key={featureKey} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${textColor}`} />
                      <span className="text-xs text-sub">{t(featureKey)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}