import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, X, ArrowLeft, Stethoscope, ChevronDown
} from 'lucide-react';
import { useFadeIn, useScrollFade, usePageLeave } from '../../hooks/gsap';
import useT from '../../hooks/useT';
import api from '../../lib/axios';
import Navbar from '../../components/website/Navbar';
import Footer from '../../components/website/Footer';
import { DoctorCardSkeleton } from '../../components/ui/Skeleton';


const SPECIALITIES = [
  'All Specialities',
  'General Dentist',
  'Orthodontist',
  'Endodontist',
  'Periodontist',
  'Oral Surgeon',
  'Pediatric Dentist',
  'Prosthodontist',
];

const FALLBACK_DOCTORS = [
  { _id: '1', name: 'Dr. Samir Khelifi', speciality: 'Orthodontist', fees: 80, experience: '8 years', available: true, degree: 'DDS, MS', about: 'Orthodontics specialist', address: { line1: '123 Rue Didouche' }, slots_booked: {} },
  { _id: '2', name: 'Dr. Fatima Zohra', speciality: 'General Dentist', fees: 50, experience: '12 years', available: true, degree: 'BDS', about: 'General dentistry', address: { line1: '45 Boulevard Zirout' }, slots_booked: {} },
  { _id: '3', name: 'Dr. Karim Benali', speciality: 'Oral Surgeon', fees: 120, experience: '15 years', available: true, degree: 'DDS, OMFS', about: 'Oral surgery expert', address: { line1: '78 Rue Khemisti' }, slots_booked: {} },
  { _id: '4', name: 'Dr. Nadia Messaoud', speciality: 'Pediatric Dentist', fees: 60, experience: '6 years', available: true, degree: 'DDS', about: 'Pediatric specialist', address: { line1: '12 Rue Ben Mehidi' }, slots_booked: {} },
];

function initials(name) {
  return name?.split(' ').slice(0, 2).map(w => w[0]).join('') || 'DR';
}

function DoctorCard({ doctor, onClick }) {
  const t = useT();
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(doctor._id)}
      className="doctor-card  bg-white border border-border rounded-[10px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 flex flex-col cursor-pointer"
    >
      <div className="h-80 relative bg-linear-to-br from-accent-soft/20 to-accent-soft/5 flex items-center justify-center">
        {doctor.image ? (
          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        ) : (
          <div className="w-18 h-18 rounded-full bg-linear-to-br from-primary-deep to-primary flex items-center justify-center text-2xl font-bold text-white font-serif">
            {initials(doctor.name)}
          </div>
        )}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
          doctor.available ? 'bg-white/95 text-emerald-600' : 'bg-white/80 text-red-500'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {doctor.available ? t('available') : t('unavailable')}
        </div>
        <div className="absolute bottom-3 left-3 bg-primary-deep/85 backdrop-blur-sm rounded-lg px-2.5 py-1 text-sm font-bold text-white">
          {doctor.fees}DA<span className="text-xs font-normal opacity-80">/{t('session')}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div>
          <h3 className="text-lg font-bold text-text font-serif">{doctor.name}</h3>
          <p className="text-sm font-medium text-primary">{t(doctor.speciality.toLowerCase().replace(/ /g, '')) || doctor.speciality}</p>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const t = useT();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specialities');
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [onlyAvail, setOnlyAvail] = useState(false);
  const gridRef = useRef(null);
  const pageRef = useRef(null);
  const breadcrumbRef = useRef(null)
  const titleRef      = useRef(null)
  const subtitleRef   = useRef(null)
  const searchRef     = useRef(null)

  // Fetch doctors
  useEffect(() => {
    api.get('/doctor/all-doctors')
      .then(({ data }) => {
        if (data.success && data.data?.length) {
          setDoctors(data.data);
        } else {
          setDoctors(FALLBACK_DOCTORS);
        }
      })
      .catch(() => setDoctors(FALLBACK_DOCTORS))
      .finally(() => setLoading(false));
  }, []);

  // Entrance animations
  useFadeIn(breadcrumbRef, { y: -10, duration: 0.5 })
useFadeIn(titleRef,      { y: 30,  duration: 0.7, delay: 0.1 })
useFadeIn(subtitleRef,   { y: 20,  duration: 0.6, delay: 0.25 })
useFadeIn(searchRef,     { y: 20,  duration: 0.6, delay: 0.4 })
useScrollFade(gridRef, { selector: '.doctor-card', y: 40, stagger: 0.08, start: 'top 85%' }, [loading])

  // Page exit animation
  const { leaveAndGo } = usePageLeave(pageRef);
  const handleDoctorClick = (doctorId) => {
    leaveAndGo(() => navigate(`/doctors/${doctorId}`));
  };

  // Filtering logic
  const filtered = doctors
    .filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.speciality.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = specialty === 'All Specialities' || d.speciality === specialty;
      const matchAvail = !onlyAvail || d.available;
      return matchSearch && matchSpecialty && matchAvail;
    })
    .sort((a, b) => {
      if (sortBy === 'fees-asc') return a.fees - b.fees;
      if (sortBy === 'fees-desc') return b.fees - a.fees;
      if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
      return a.name.localeCompare(b.name);
    });

  const activeFilters = [
    specialty !== 'All Specialities' && specialty,
    onlyAvail && 'Available only',
    sortBy !== 'name' && `Sort: ${sortBy === 'fees-asc' ? 'Price Low-High' : sortBy === 'fees-desc' ? 'Price High-Low' : 'Most Experienced'}`,
  ].filter(Boolean);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-bg font-sans">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <DoctorCardSkeleton  key={i} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div ref={pageRef}>
      <Navbar />
      <div className="min-h-screen bg-bg font-sans">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-linear-to-r from-primary-deep via-primary-deep/90 to-primary pt-28 pb-16">
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 ">
            <div ref={breadcrumbRef} className="flex items-center gap-2 mb-4">
              <Link to="/" className="text-sm text-white/60 hover:text-primary-soft transition flex items-center gap-1">
                <ArrowLeft size={13} /> {t('home')}
              </Link>
              <span className="text-white/40 text-sm">/</span>
              <span className="text-sm text-white/80">{t('doctors')}</span>
            </div>
            <h1 ref={titleRef} className="heading-lg text-4xl md:text-5xl font-bold text-white mb-3 font-serif">
              {t('doctorsHeroTitle')}{' '}
              <span className="text-accent-soft">{t('doctorsHeroHighlight')}</span>
            </h1>
            <p ref={subtitleRef} className="text-white/70 text-lg max-w-xl mb-8">{t('doctorsHeroSub')}</p>
            <div ref={searchRef} className="flex flex-wrap gap-3 max-w-2xl">
              <div className="flex-1 relative min-w-60">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('searchDoctorsPlaceholder')}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-white/20 bg-white/95 text-text placeholder:text-muted focus:outline-none focus:border-white/60 transition-all shadow-md"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text">
                    <X size={15} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-white/30 bg-white/10 text-white font-medium hover:bg-white/20 transition whitespace-nowrap"
              >
                <SlidersHorizontal size={17} />
                {t('filters')} {activeFilters.length > 0 && `(${activeFilters.length})`}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-5 items-end">
              <div className="min-w-45">
                <label className="text-xs font-semibold text-muted uppercase tracking-wide">{t('speciality')}</label>
                <div className="relative mt-1">
                  <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full appearance-none px-3 py-2 pr-8 rounded-lg border border-border bg-white text-text text-sm cursor-pointer focus:outline-none focus:border-primary">
                    {SPECIALITIES.map(s => <option key={s} value={s}>{t(s.toLowerCase().replace(/ /g, '')) || s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </div>
              <div className="min-w-40">
                <label className="text-xs font-semibold text-muted uppercase tracking-wide">{t('sortBy')}</label>
                <div className="relative mt-1">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full appearance-none px-3 py-2 pr-8 rounded-lg border border-border bg-white text-text text-sm cursor-pointer focus:outline-none focus:border-primary">
                    <option value="name">{t('sortName')}</option>
                    <option value="fees-asc">{t('sortFeesLow')}</option>
                    <option value="fees-desc">{t('sortFeesHigh')}</option>
                    <option value="experience">{t('sortExperience')}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">{t('availability')}</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative w-9 h-5">
                    <input type="checkbox" checked={onlyAvail} onChange={e => setOnlyAvail(e.target.checked)} className="sr-only" />
                    <div onClick={() => setOnlyAvail(!onlyAvail)} className={`absolute inset-0 rounded-full transition-colors ${onlyAvail ? 'bg-primary' : 'bg-border'}`}>
                      <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${onlyAvail ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </div>
                  <span className="text-sm text-sub">{t('availableOnly')}</span>
                </label>
              </div>
              {activeFilters.length > 0 && (
                <button onClick={() => { setSpecialty('All Specialities'); setSortBy('name'); setOnlyAvail(false) }} className="text-red-500 text-sm font-medium hover:underline ml-auto">
                  {t('clearFilters')}
                </button>
              )}
            </div>
            {activeFilters.length > 0 && (
              <div className="px-40 pb-4 flex flex-wrap gap-2 border-t border-border pt-3">
                {activeFilters.map(f => (
                  <span key={f} className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/30 text-primary-deep border border-primary/20">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Specialty Pills */}
        <div className="border-b border-border bg-white">
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {SPECIALITIES.map(s => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  specialty === s ? 'bg-primary-deep text-white shadow-md' : 'bg-gray-100 text-sub hover:bg-gray-200'
                }`}
              >
                {t(s.toLowerCase().replace(/ /g, '')) || s}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <p className="text-sm text-sub">
              {t('showing')} <strong className="text-text">{filtered.length}</strong> {t('of')} {doctors.length} {t('doctors')}
              {search && <> {t('matching')} <em className="text-primary">"{search}"</em></>}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-sm text-primary hover:underline flex items-center gap-1">
                <X size={13} /> {t('clearSearch')}
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-soft/30 flex items-center justify-center mb-4">
                <Stethoscope size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text mb-2">{t('noDoctorsFound')}</h3>
              <p className="text-sub max-w-md mx-auto mb-6">{t('noDoctorsFoundMsg')}</p>
              <button onClick={() => { setSearch(''); setSpecialty('All Specialities'); setOnlyAvail(false) }} className="px-5 py-2 rounded-full bg-primary-deep text-white font-medium hover:bg-primary-deep/90 transition">
                {t('clearAllFilters')}
              </button>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} onClick={handleDoctorClick} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}