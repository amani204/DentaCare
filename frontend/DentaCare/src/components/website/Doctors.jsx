import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFadeIn, useScrollFade } from '../../hooks/gsap';
import useT from '../../hooks/useT';
import api from '../../lib/axios';
import { DoctorCardSkeleton } from '../ui/Skeleton';

const FALLBACK_DOCTORS = [
  { _id: '1', name: 'Dr. Samir Khelifi', speciality: 'Orthodontist', fees: 80, experience: '8 years', available: true },
  { _id: '2', name: 'Dr. Fatima Zohra', speciality: 'General Dentist', fees: 50, experience: '12 years', available: true },
  { _id: '3', name: 'Dr. Karim Benali', speciality: 'Oral Surgeon', fees: 120, experience: '15 years', available: true },
  { _id: '4', name: 'Dr. Nadia Messaoud', speciality: 'Pediatric Dentist', fees: 60, experience: '6 years', available: true },
];

export default function Doctors() {
  const t = useT();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctor/all-doctors')
      .then(({ data }) => {
        if (data.success && data.data && data.data.length) {
          setDoctors(data.data.slice(0, 4));
        } else {
          setDoctors(FALLBACK_DOCTORS.slice(0, 4));
        }
      })
      .catch(() => setDoctors(FALLBACK_DOCTORS.slice(0, 4)))
      .finally(() => setLoading(false));
  }, []);

  // Entrance animations using the new hooks
  useFadeIn(headerRef, { y: 30, duration: 0.8 });
  useScrollFade(gridRef, { selector: '.doctor-card', y: 50, stagger: 0.12, start: 'top 80%' }, [loading])
  const initials = (name) => name?.split(' ').slice(0, 2).map(w => w[0]).join('') || 'DR';

  if (loading) {
    return (
      <section id="doctors" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={headerRef}
          id="doctors-header"
          className="flex justify-between items-end flex-wrap gap-6 mb-14 "
        >
          <div>
            <div className="mb-4">
              <span className="text-xs font-semibold text-accent-soft uppercase tracking-wider bg-accent-soft/10 px-3 py-1 rounded-full">
                {t('doctorsTag')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text max-w-md">
              {t('doctorsHeading1')}{' '}
              <span className="text-text">{t('doctorsHeading2')}</span>
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-sub mb-3">{t('doctorsSub')}</p>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-gray-500 font-medium hover:gap-3 hover:text-primary transition-all duration-200"
            >
              {t('viewAllDoctors')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div
          ref={gridRef}
          id="doctors-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {doctors.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/doctors/${doc._id}`)}
              className="doctor-card  bg-white border border-border rounded-[10px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-sm hover:border-gray-500 group cursor-pointer"
            >
              <div className="h-80 relative bg-linear-to-br from-accent-soft/20 to-accent-soft/5 flex items-center justify-center overflow-hidden">
               {doc.image ? (
                <img
                src={doc.image?.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} alt={doc.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               />
              ) : (
               <div className="w-20 h-20 rounded-full bg-linear-to-br from-accent-soft to-accent-soft/70 flex items-center justify-center text-2xl font-bold text-white">
                {initials(doc.name)}
                 </div>
                )}
                <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  doc.available
                    ? 'bg-white/95 text-emerald-600'
                    : 'bg-white/80 text-red-500'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {doc.available ? t('available') : t('unavailable')}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-text mb-1">{doc.name}</h3>
                <p className="text-sm text-text/50 font-medium mb-3">{t(doc.speciality.toLowerCase().replace(/ /g, '')) || doc.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}