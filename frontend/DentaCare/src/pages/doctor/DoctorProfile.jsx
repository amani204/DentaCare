// src/pages/doctor/DoctorProfile.jsx
import { useEffect, useState } from 'react'
import { Camera, Save, User, Mail, Stethoscope, GraduationCap, Clock, DollarSign, FileText, MapPin, Check, Edit2 } from 'lucide-react'
import useDoctorStore from '../../store/doctorStore'

import api from '../../lib/axios'
import useDT from '../../hooks/useDT'
import { PageLoader } from '../../components/ui/Skeleton'

function Field({ label, icon: Icon, children, error }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-sub mb-1.5">
        {Icon && <Icon size={12} />} {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function DoctorProfile() {
  const { dToken, doctor, setDoctor, lang } = useDoctorStore()
  const t = useDT()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const [form, setForm] = useState({
    name: '', email: '', speciality: '', degree: '', experience: '',
    fees: '', about: '', available: true,
    address: { line1: '', line2: '' },
  })

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || '',
        email: doctor.email || '',
        speciality: doctor.speciality || '',
        degree: doctor.degree || '',
        experience: doctor.experience || '',
        fees: doctor.fees || '',
        about: doctor.about || '',
        available: doctor.available ?? true,
        address: doctor.address || { line1: '', line2: '' },
      })
    }
  }, [doctor])

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImage(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('fees', form.fees)
      fd.append('about', form.about)
      fd.append('available', form.available)
      fd.append('address', JSON.stringify(form.address))
      if (image) fd.append('image', image)

      // Only send editable fields to backend
      const { data } = await api.put('/doctor/update-profile', fd, { headers: { dtoken: dToken } })
      if (data.success) {
        setDoctor(data.doctor || { ...doctor, ...form, image: preview || doctor?.image })
        setSuccess(true)
        setEditing(false)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (!doctor) return <PageLoader />;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text">{t('myProfile')}</h2>
          <p className="text-sm text-sub">{lang === 'en' ? 'Manage your information' : 'Gérez vos informations'}</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-hov transition-all shadow-md"
          >
            <Edit2 size={16} /> {t('editProfile')}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setPreview(null); setImage(null) }}
              className="px-4 py-2 rounded-xl text-sub border border-border hover:bg-bg transition-all"
            >
              {lang === 'en' ? 'Cancel' : 'Annuler'}
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-hov transition-all disabled:opacity-50"
            >
              <Save size={14} /> {loading ? t('saving') : t('saveChanges')}
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <Check size={16} /> {t('profileUpdated')}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

        {/* Left — Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg p-5">
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {(preview || doctor?.image) ? (
                <img
                  src={preview || doctor?.image}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-soft shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-soft to-primary flex items-center justify-center text-3xl font-bold text-primary-deep border-4 border-primary-soft shadow-lg">
                  {doctor?.name?.charAt(0) || 'D'}
                </div>
              )}
              {editing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-hov transition-all">
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-text">Dr. {doctor?.name}</h3>
              <p className="text-sm text-sub mt-1">{doctor?.speciality}</p>
            </div>

            {/* Availability Toggle */}
            <div className="w-full flex items-center justify-between p-3 bg-bg rounded-xl border border-border">
              <span className="text-sm text-sub">{t('available')}</span>
              {editing ? (
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
                  />
                  <span className="toggle-track" />
                </label>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${doctor?.available ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <span className={`text-sm font-medium ${doctor?.available ? 'text-emerald-600' : 'text-red-500'}`}>
                    {doctor?.available ? (lang === 'en' ? 'Yes' : 'Oui') : (lang === 'en' ? 'No' : 'Non')}
                  </span>
                </div>
              )}
            </div>

            {/* Stats Pills */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="bg-bg rounded-lg p-2 text-center border border-border">
                <p className="text-[10px] text-muted uppercase">{lang === 'en' ? 'Degree' : 'Diplôme'}</p>
                <p className="text-sm font-semibold text-text">{doctor?.degree || '—'}</p>
              </div>
              <div className="bg-bg rounded-lg p-2 text-center border border-border">
                <p className="text-[10px] text-muted uppercase">{lang === 'en' ? 'Experience' : 'Exp.'}</p>
                <p className="text-sm font-semibold text-text">{doctor?.experience || '—'}y</p>
              </div>
              <div className="col-span-2 bg-bg rounded-lg p-2 text-center border border-border">
                <p className="text-[10px] text-muted uppercase">{lang === 'en' ? 'Fees' : 'Honoraires'}</p>
                <p className="text-sm font-semibold text-primary">${doctor?.fees || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Editable Info */}
        <div className="flex flex-col gap-5">
          {/* Account Information - */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg p-5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
              {lang === 'en' ? 'Account Information' : 'Informations du compte'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t('email')} icon={Mail}>
                <input
                  className="input"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  readOnly={!editing}
                />
              </Field>
              <Field label={t('speciality')} icon={Stethoscope}>
                <input
                  className="input"
                  value={form.speciality}
                  onChange={e => setForm(f => ({ ...f, speciality: e.target.value }))}
                  readOnly={!editing}
                />
              </Field>
              <Field label={t('degree')} icon={GraduationCap}>
                <input
                  className="input"
                  value={form.degree}
                  onChange={e => setForm(f => ({ ...f, degree: e.target.value }))}
                  readOnly={!editing}
                />
              </Field>
              <Field label={t('experience')} icon={Clock}>
                <input
                  className="input"
                  value={form.experience}
                  onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                  readOnly={!editing}
                />
              </Field>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg p-5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
              {lang === 'en' ? 'Professional Information' : 'Informations professionnelles'}
            </p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={t('name')} icon={User}>
                  <input
                    className="input"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    readOnly={!editing}
                  />
                </Field>
                <Field label={t('fees')} icon={DollarSign}>
                  <input
                    type="number"
                    className="input"
                    value={form.fees}
                    onChange={e => setForm(f => ({ ...f, fees: e.target.value }))}
                    readOnly={!editing}
                  />
                </Field>
              </div>

              <Field label={t('about')} icon={FileText}>
                <textarea
                  className="input resize-none min-h-25"
                  value={form.about}
                  onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
                  readOnly={!editing}
                  rows={3}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={`${t('address')} 1`} icon={MapPin}>
                  <input
                    className="input"
                    value={form.address?.line1 || ''}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address, line1: e.target.value } }))}
                    readOnly={!editing}
                  />
                </Field>
                <Field label={`${t('address')} 2`} icon={MapPin}>
                  <input
                    className="input"
                    value={form.address?.line2 || ''}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address, line2: e.target.value } }))}
                    readOnly={!editing}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}