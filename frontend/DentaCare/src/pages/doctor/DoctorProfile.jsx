// src/pages/doctor/DoctorProfile.jsx
import useDoctorStore from '../../store/doctorStore'
export default function DoctorProfile() {
  const { lang } = useDoctorStore()
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '2rem', textAlign: 'center', color: 'var(--color-sub)' }}>
      <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
        {lang === 'en' ? 'Profile page — coming next session' : 'Page profil — prochaine session'}
      </p>
    </div>
  )
}
