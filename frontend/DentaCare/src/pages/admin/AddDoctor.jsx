
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Briefcase, Upload, X, Plus, Image as ImageIcon, CheckCircle, AlertCircle, MapPin} from 'lucide-react'
import useAdminStore from '../../store/adminStore'
import useT from '../../hooks/useT'
import api from '../../lib/axios'

const SPECIALITIES = ['General Dentist','Orthodontist','Endodontist','Periodontist','Oral Surgeon','Pediatric Dentist','Prosthodontist']

const INIT = { name:'', email:'', password:'', speciality:'General Dentist', degree:'', experience:'', about:'', fees:'', line1:'', line2:'' }

function Field({ label, error, icon: Icon, children }) {
  return (
    <div>
      <label className="label-text block mb-1.5 items-center gap-1.5">
        {Icon && <Icon size={14} className="text-muted" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="card p-5">
      <p className="label-text uppercase tracking-wide mb-4 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-primary" />}
        {title}
      </p>
      <div className="flex flex-col gap-3.5">{children}</div>
    </div>
  )
}

export default function AddDoctor() {
  const { aToken } = useAdminStore()
  const navigate   = useNavigate()
  const t          = useT()

  const [form,    setForm]    = useState(INIT)
  const [image,   setImage]   = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  const setField = (k, v) => { 
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name = t('required')
    if (!form.email.trim())       e.email = t('required')
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = t('invalidEmail')
    if (!form.password)           e.password = t('required')
    else if (form.password.length < 8) e.password = t('minPassword')
    if (!form.degree.trim())      e.degree = t('required')
    if (!form.experience.trim())  e.experience = t('required')
    if (!form.about.trim())       e.about = t('required')
    if (!form.fees)               e.fees = t('required')
    else if (Number(form.fees) <= 0) e.fees = t('minFees')
    if (!image)                   e.image = t('uploadImage')
    return e
  }

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImage(f)
    setPreview(URL.createObjectURL(f))
    setErrors(err => ({ ...err, image: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiErr('')
    try {
      const fd = new FormData()
      Object.entries({ 
        name: form.name, email: form.email, password: form.password,
        speciality: form.speciality, degree: form.degree, 
        experience: form.experience, about: form.about, fees: form.fees 
      }).forEach(([k,v]) => fd.append(k, v))
      fd.append('address', JSON.stringify({ line1: form.line1, line2: form.line2 }))
      fd.append('image', image)
      const { data } = await api.post('/admin/add-doctor', fd, { 
        headers: { atoken: aToken, 'Content-Type': 'multipart/form-data' } 
      })
      if (data.success) { 
        setSuccess(true)
        setTimeout(() => navigate('/admin/doctors'), 1500)
      } else setApiErr(data.message)
    } catch { setApiErr(t('error')) }
    finally { setLoading(false) }
  }

  const inputClass = (key) => `input ${errors[key] ? 'border-red-500 focus:ring-red-500/20' : ''}`

  return (
    <div className="max-w-2xl animate-fade-in mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h2 className="page-title">{t('addNewDoctor')}</h2>
        <p className="sub-text">{t('addDoctorSub')}</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-3.5 py-2.5 text-sm mb-4 flex items-center gap-2">
          <CheckCircle size={16} /> ✓ {t('doctorAdded')}
        </div>
      )}

      {/* Error Message */}
      {apiErr && (
        <div className="bg-red-50 border border-red-200 text-red-500 rounded-lg px-3.5 py-2.5 text-sm mb-4 flex items-center gap-2">
          <AlertCircle size={16} /> {apiErr}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Photo Section */}
        <Section title={t('doctorPhoto')} icon={ImageIcon}>
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className={`
              w-20 h-20 rounded-xl shrink-0 border-2 border-dashed 
              flex items-center justify-center overflow-hidden transition-all
              ${errors.image 
                ? 'border-red-500 bg-red-50' 
                : 'border-border bg-bg group-hover:border-primary group-hover:bg-primary-soft/20'}
            `}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload size={24} className="text-muted group-hover:text-primary transition-colors" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-text flex items-center gap-1">
                <Upload size={14} /> {t('uploadPhoto')}
              </p>
              <p className="sub-text text-xs">{t('uploadHint')}</p>
              {errors.image && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.image}
                </p>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </Section>

        {/* Personal Info */}
        <Section title={t('personalInfo')} icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Field label={t('fullName')} error={errors.name} >
              <input 
                className={inputClass('name')} 
                placeholder="Dr. John Smith"
                value={form.name} 
                onChange={e => setField('name', e.target.value)} 
              />
            </Field>
            <Field label={t('email')} error={errors.email} >
              <input 
                type="email"
                className={inputClass('email')} 
                placeholder="doctor@dentacare.com"
                value={form.email} 
                onChange={e => setField('email', e.target.value)} 
              />
            </Field>
            <Field label={t('password')} error={errors.password} >
              <input 
                type="password"
                className={inputClass('password')} 
                placeholder="Min 8 characters"
                value={form.password} 
                onChange={e => setField('password', e.target.value)} 
              />
            </Field>
            <Field label={t('speciality')} >
              <select 
                className="input" 
                value={form.speciality} 
                onChange={e => setField('speciality', e.target.value)}
              >
                {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* Professional Info */}
        <Section title={t('professionalInfo')} icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <Field label={t('degree')} error={errors.degree} >
              <input 
                className={inputClass('degree')} 
                placeholder="DDS, BDS..."
                value={form.degree} 
                onChange={e => setField('degree', e.target.value)} 
              />
            </Field>
            <Field label={t('experienceYrs')} error={errors.experience}>
              <input 
                className={inputClass('experience')} 
                placeholder="5 years"
                value={form.experience} 
                onChange={e => setField('experience', e.target.value)} 
              />
            </Field>
            <Field label={t('feesLabel')} error={errors.fees} >
              <input 
                type="number"
                className={inputClass('fees')} 
                placeholder="50"
                value={form.fees} 
                onChange={e => setField('fees', e.target.value)} 
              />
            </Field>
          </div>
          <Field label={t('about')} error={errors.about} >
            <textarea 
              className={`${inputClass('about')} resize-none min-h-20`}
              placeholder="Brief description about the doctor..."
              value={form.about} 
              onChange={e => setField('about', e.target.value)} 
              rows={3}
            />
          </Field>
        </Section>

        {/* Address */}
        <Section title={t('address')} icon={MapPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Field label={t('addressLine1')} >
              <input 
                className="input" 
                placeholder="123 Main St"
                value={form.line1} 
                onChange={e => setField('line1', e.target.value)} 
              />
            </Field>
            <Field label={t('addressLine2')}>
              <input 
                className="input" 
                placeholder="Suite 4B"
                value={form.line2} 
                onChange={e => setField('line2', e.target.value)} 
              />
            </Field>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button 
            type="button" 
            onClick={() => navigate('/admin/doctors')}
            className="btn btn-ghost flex items-center gap-2"
          >
            <X size={16} /> {t('cancel')}
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('adding')}
              </>
            ) : (
              <>
                <Plus size={16} /> {t('addDoctorBtn')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}