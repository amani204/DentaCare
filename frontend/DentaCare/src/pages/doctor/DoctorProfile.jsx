import { useEffect, useState, useRef } from 'react'
import { Camera, Save, User, Mail, Stethoscope, GraduationCap, Clock, DollarSign, FileText, MapPin, Edit2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import useDoctorStore from '../../store/doctorStore'
import api from '../../lib/axios'
import useT from '../../hooks/useT'
import { PageLoader } from '../../components/ui/Skeleton'
import useAdminStore from '../../store/adminStore'

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-sub mb-1.5">
        {Icon && <Icon size={12} />} {label}
      </label>
      {children}
    </div>
  )
}

export default function DoctorProfile() {
  const { dToken, doctor: storeDoctor, setDoctor } = useDoctorStore()
  const {  lang } = useAdminStore()
  const t = useT()

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const [form, setForm] = useState({
    name: '', email: '', speciality: '', degree: '', experience: '',
    fees: '', about: '', available: true,
    address: { line1: '', line2: '' },
  })

  const fetchedRef = useRef(false) // prevent double fetch

  // Fetch full doctor profile only once (or when doctor ID changes)
  useEffect(() => {
    if (fetchedRef.current) return
    if (!storeDoctor?._id) {
      setLoading(false)
      return
    }

    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctor/${storeDoctor._id}`)
        if (data.success && data.data) {
          const doc = data.data
          setForm({
            name: doc.name || '',
            email: doc.email || '',
            speciality: doc.speciality || '',
            degree: doc.degree || '',
            experience: doc.experience || '',
            fees: doc.fees || '',
            about: doc.about || '',
            available: doc.available ?? true,
            address: doc.address || { line1: '', line2: '' },
          })
          if (doc.image) setPreview(doc.image)
          // Optionally update store with full data
          setDoctor(doc)
        } else {
          toast.error('Failed to load profile')
        }
      } catch (err) {
        console.error(err)
        toast.error(t('error') || 'Failed to load profile')
      } finally {
        setLoading(false)
        fetchedRef.current = true
      }
    }
    fetchDoctor()
  }, [storeDoctor?._id, setDoctor, t]) // dependencies: only when doctor ID changes

  // If the storeDoctor changes because of an update, we don't want to refetch
  // The fetchedRef ensures that.

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImage(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    setUpdating(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('fees', form.fees)
      fd.append('about', form.about)
      fd.append('available', form.available)
      fd.append('address', JSON.stringify(form.address))
      if (image) fd.append('image', image)

      const { data } = await api.put('/doctor/update-profile', fd, { headers: { dtoken: dToken } })
      if (data.success) {
        const updatedDoctor = {
          ...storeDoctor,
          name: form.name,
          fees: form.fees,
          about: form.about,
          available: form.available,
          address: form.address,
          image: preview || storeDoctor?.image,
        }
        setDoctor(updatedDoctor)
        toast.success(t('profileUpdated') || 'Profile updated successfully')
        setEditing(false)
        setImage(null)
        // Do NOT refetch; the store already has the updated data
      } else {
        toast.error(data.message || t('error'))
      }
    } catch (e) {
      console.error(e)
      toast.error(t('error'))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <PageLoader />
  if (!storeDoctor) return <div className="p-8 text-center">No profile data found.</div>

  const isEditable = editing

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text">{t('myProfile')}</h2>
          <p className="text-sm text-sub">{lang === 'en' ? 'Manage your information' : 'Gérez vos informations'}</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-hov transition-all shadow-md">
            <Edit2 size={16} /> {t('editProfile')}
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setPreview(storeDoctor?.image || null); setImage(null) }} className="px-4 py-2 rounded-xl text-sub border border-border hover:bg-bg transition-all">
              {lang === 'en' ? 'Cancel' : 'Annuler'}
            </button>
            <button onClick={handleSave} disabled={updating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-hov transition-all disabled:opacity-50">
              <Save size={14} /> {updating ? t('saving') : t('saveChanges')}
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Left — Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[10px] border border-primary/10 shadow-lg p-5">
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {preview ? (
                <img src={preview} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-primary-soft shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-soft to-primary flex items-center justify-center text-3xl font-bold text-primary-deep border-4 border-primary-soft shadow-lg">
                  {form.name?.charAt(0) || 'D'}
                </div>
              )}
              {isEditable && (
                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-hov transition-all">
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-text">{form.name}</h3>
              <p className="text-sm text-sub mt-1">{form.speciality}</p>
            </div>

            {/* Availability Toggle */}
            <div className="w-full flex items-center justify-between p-3 bg-bg rounded-xl border border-border">
              <span className="text-sm text-sub">{t('available')}</span>
              {isEditable ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${form.available ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <span className={`text-sm font-medium ${form.available ? 'text-emerald-600' : 'text-red-500'}`}>
                    {form.available ? (lang === 'en' ? 'Yes' : 'Oui') : (lang === 'en' ? 'No' : 'Non')}
                  </span>
                </div>
              )}
            </div>

            {/* Stats Pills */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="bg-bg rounded-lg p-2 text-center border border-border">
                <p className="text-[10px] text-muted uppercase">{lang === 'en' ? 'Degree' : 'Diplôme'}</p>
                <p className="text-sm font-semibold text-text">{form.degree || '—'}</p>
              </div>
              <div className="bg-bg rounded-lg p-2 text-center border border-border">
                <p className="text-[10px] text-muted uppercase">{lang === 'en' ? 'Experience' : 'Exp.'}</p>
                <p className="text-sm font-semibold text-text">{form.experience || '—'}y</p>
              </div>
              <div className="col-span-2 bg-bg rounded-lg p-2 text-center border border-border">
                <p className="text-[10px] text-muted uppercase">{lang === 'en' ? 'Fees' : 'Honoraires'}</p>
                <p className="text-sm font-semibold text-primary">{form.fees || 0}DA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Editable Info */}
        <div className="flex flex-col gap-5">
          {/* Account Information (read‑only) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[10px] border border-primary/10 shadow-lg p-5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
              {lang === 'en' ? 'Account Information' : 'Informations du compte'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t('email')} icon={Mail}>
                <input className="input bg-gray-50 text-gray-500" value={form.email} readOnly />
              </Field>
              <Field label={t('speciality')} icon={Stethoscope}>
                <input className="input bg-gray-50 text-gray-500" value={form.speciality} readOnly />
              </Field>
              <Field label={t('degree')} icon={GraduationCap}>
                <input className="input bg-gray-50 text-gray-500" value={form.degree} readOnly />
              </Field>
              <Field label={t('experience')} icon={Clock}>
                <input className="input bg-gray-50 text-gray-500" value={form.experience} readOnly />
              </Field>
            </div>
          </div>

          {/* Professional Information (editable) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[10px] border border-primary/10 shadow-lg p-5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
              {lang === 'en' ? 'Professional Information' : 'Informations professionnelles'}
            </p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={t('name')} icon={User}>
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} readOnly={!isEditable} />
                </Field>
                <Field label={t('fees')} icon={DollarSign}>
                  <input type="number" className="input" value={form.fees} onChange={e => setForm(f => ({ ...f, fees: e.target.value }))} readOnly={!isEditable} />
                </Field>
              </div>

              <Field label={t('about')} icon={FileText}>
                <textarea className="input resize-none min-h-25" value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} readOnly={!isEditable} rows={3} />
              </Field>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}