// src/components/website/Doctors.jsx
import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowRight, MapPin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../../lib/axios'

gsap.registerPlugin(ScrollTrigger)

// Fallback doctors if API not available
const FALLBACK_DOCTORS = [
  { _id:'1', name:'Dr. Samir Khelifi',  speciality:'Orthodontist',       fees:80,  experience:'8 years',  available:true },
  { _id:'2', name:'Dr. Fatima Zohra',   speciality:'General Dentist',    fees:50,  experience:'12 years', available:true },
  { _id:'3', name:'Dr. Karim Benali',   speciality:'Oral Surgeon',       fees:120, experience:'15 years', available:true },
  { _id:'4', name:'Dr. Nadia Messaoud', speciality:'Pediatric Dentist',  fees:60,  experience:'6 years',  available:true },
]

export default function Doctors() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/doctor/list')
      .then(({ data }) => {
        if (data.success && data.doctors?.length) {
          setDoctors(data.doctors.slice(0, 4))
        } else {
          setDoctors(FALLBACK_DOCTORS)
        }
      })
      .catch(() => setDoctors(FALLBACK_DOCTORS))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || !gridRef.current) return

    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' } }
    )

    const cards = gridRef.current.querySelectorAll('.doctor-card')
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none none' } }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [loading])

  const initials = (name) => name?.split(' ').slice(0,2).map(w => w[0]).join('') || 'DR'

  return (
    <section id="doctors" className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-main">

        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="section-label">
              <span className="label-caps">Our Specialists</span>
            </div>
            <h2 className="heading-lg" style={{ maxWidth: 440 }}>
              Meet Our{' '}
              <span className="italic-accent">Expert Doctors</span>
            </h2>
          </div>
          <div>
            <p className="body-md" style={{ maxWidth: 320, marginBottom: '1rem' }}>
              Certified professionals with years of experience, dedicated to your smile.
            </p>
            <Link to="/doctors" className="btn-outline-main" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
              View All Doctors <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Grid */}
        {loading
          ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <div className="loader-spin" />
            </div>
          )
          : (
            <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
              {doctors.map((doc) => (
                <div key={doc._id}
                  className="doctor-card"
                  style={{
                    opacity: 0,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 24, overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-blue)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--color-border)' }}>

                  {/* Image area */}
                  <div style={{
                    height: 200, position: 'relative',
                    background: 'linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-primary-pale) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {doc.image
                      ? <img src={doc.image} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : (
                        <div style={{
                          width: 80, height: 80, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #091E5D, #7097D2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.5rem', fontWeight: 700, color: 'white',
                          fontFamily: 'var(--font-display)',
                        }}>{initials(doc.name)}</div>
                      )
                    }
                    {/* Available badge */}
                    <div style={{
                      position: 'absolute', top: '0.75rem', right: '0.75rem',
                      background: doc.available ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
                      borderRadius: 999, padding: '0.25rem 0.625rem',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.7rem', fontWeight: 600,
                      color: doc.available ? '#16A34A' : '#EF4444',
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: doc.available ? '#16A34A' : '#EF4444' }} />
                      {doc.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                      {doc.name}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500, marginBottom: '0.75rem' }}>
                      {doc.speciality}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />)}
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', marginLeft: '0.25rem' }}>5.0</span>
                      </div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-sub)' }}>{doc.experience} exp.</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-deep)' }}>
                          ${doc.fees}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>/session</span>
                      </div>
                      <Link to={`/book/${doc._id}`}
                        style={{
                          fontSize: '0.8125rem', fontWeight: 600,
                          color: 'white', background: 'var(--color-primary-deep)',
                          padding: '0.45rem 0.875rem', borderRadius: 999,
                          textDecoration: 'none', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary-deep)' }}>
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }

      </div>
    </section>
  )
}
