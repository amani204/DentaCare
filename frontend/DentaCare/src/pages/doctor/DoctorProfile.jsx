import { useEffect, useState, useRef } from 'react'
import { Camera, Save, User, Mail, Stethoscope, GraduationCap, Clock, DollarSign, FileText, MapPin, Edit2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import useDoctorStore from '../../store/doctorStore'
import api from '../../lib/axios'
import useT from '../../hooks/useT'
import { PageLoader } from '../../components/ui/Skeleton'
import useAdminStore from '../../store/adminStore'

function Field({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-sub uppercase tracking-wider">
        {Icon && <Icon size={12} />} {label}
      </label>
      {children}
    </div>
  )
}

export default function DoctorProfile() {
  const { dToken, doctor: storeDoctor, setDoctor } = useDoctorStore()
  const { lang } = useAdminStore()
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

  const fetchedRef = useRef(false)

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
          setDoctor(doc)
        }
      } catch (err) {
        console.error(err)
        toast.error(t('error'))
      } finally {
        setLoading(false)
        fetchedRef.current = true
      }
    }
    fetchDoctor()
  }, [storeDoctor?._id, setDoctor, t])

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
        setDoctor({ ...storeDoctor, ...form, image: preview || storeDoctor?.image })
        toast.success(t('profileUpdated'))
        setEditing(false)
        setImage(null)
      } else {
        toast.error(data.message || t('error'))
      }
    } catch (e) {
      toast.error(t('error'))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <PageLoader />
  if (!storeDoctor) return <div className="p-8 text-center text-muted">No profile data found.</div>

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* MATCHED HERO HEADER */}
      <div className="card p-6 flex items-center justify-between bg-white border border-border rounded-xl shadow-xs">
        <div>
          <h2 className="text-[20px] font-bold text-primary-deep">{t('myProfile')}</h2>
          <p className="text-sm text-sub">{lang === 'en' ? 'Update and manage your professional details.' : 'Gérez vos informations professionnelles.'}</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hov transition-all shadow-sm">
            <Edit2 size={16} /> {t('editProfile')}
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setPreview(storeDoctor?.image || null); setImage(null) }} className="px-5 py-2.5 rounded-xl text-sub border border-border hover:bg-bg transition-all">
              {t('cancel')}
            </button>
            <button onClick={handleSave} disabled={updating} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hov transition-all disabled:opacity-50">
              <Save size={16} /> {updating ? t('saving') : t('saveChanges')}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        {/* Left — Profile Card */}
        <div className="card p-6 flex flex-col items-center gap-6">
          <div className="relative">
            {preview ? (
              <img src={preview} alt="Profile" className="w-28 h-28 rounded-2xl object-cover border-2 border-border shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-bg flex items-center justify-center text-4xl font-bold text-primary border border-border">
                {form.name?.charAt(0) || 'D'}
              </div>
            )}
            {editing && (
              <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center cursor-pointer shadow-lg hover:bg-bg transition-all">
                <Camera size={18} className="text-primary" />
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl  text-text">{form.name}</h3>
            <p className="text-sm text-sub font-medium bg-primary/5 px-3 py-1 rounded-full mt-2 inline-block border border-primary/10">{form.speciality}</p>
          </div>

          <div className="w-full space-y-3 pt-4 border-t border-dashed border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-sub">{t('available')}</span>
              {editing ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              ) : (
                <span className={`text-sm  ${form.available ? 'text-emerald-600' : 'text-red-500'}`}>
                  {form.available ? t('yes') : t('no')}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-bg rounded-lg"><p className="text-[14px] text-muted ">{t('degree')}</p><p className=" text-text text-sm">{form.degree}</p></div>
              <div className="p-2 bg-bg rounded-lg"><p className="text-[14px] text-muted ">{t('experience')}</p><p className=" text-text text-sm">{form.experience} yrs</p></div>
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="space-y-5">
          {/* Read Only Info */}
          <div className="card p-6">
            <h4 className="text-sm font-sm text-text mb-5">{lang === 'en' ? 'Account Details' : 'Détails du compte'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label={t('email')} icon={Mail}><input className="input bg-bg" value={form.email} readOnly /></Field>
              <Field label={t('speciality')} icon={Stethoscope}><input className="input bg-bg" value={form.speciality} readOnly /></Field>
              <Field label={t('degree')} icon={GraduationCap}><input className="input bg-bg" value={form.degree} readOnly /></Field>
              <Field label={t('experience')} icon={Clock}><input className="input bg-bg" value={form.experience} readOnly /></Field>
            </div>
          </div>

          {/* Editable Info */}
          <div className="card p-6">
            <h4 className="text-sm  text-text mb-5">{lang === 'en' ? 'Professional Profile' : 'Profil Professionnel'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <Field label={t('name')} icon={User}><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} readOnly={!editing} /></Field>
              <Field label={t('fees')} icon={DollarSign}><input type="number" className="input" value={form.fees} onChange={e => setForm(f => ({ ...f, fees: e.target.value }))} readOnly={!editing} /></Field>
            </div>
            <Field label={t('about')} icon={FileText}><textarea className="input min-h-24" value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} readOnly={!editing} /></Field>
          </div>
        </div>
      </div>
    </div>
  )
}