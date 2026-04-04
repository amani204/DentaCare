// src/pages/website/DoctorDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, Calendar, Clock, User, Stethoscope, GraduationCap, 
  MapPin, DollarSign, Phone, Mail, ArrowLeft, CheckCircle,
  ChevronLeft, ChevronRight, X, Award, Briefcase, Heart
} from 'lucide-react'
import gsap from 'gsap'
import useT from '../../hooks/useT'
import api from '../../lib/axios'
import Navbar from '../../components/website/Navbar'
import Footer from '../../components/website/Footer'

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function fmtDate(d) {
  return `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`
}

function fmtDisplay(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function getWeekDates(baseDate) {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate)
    d.setDate(baseDate.getDate() + i)
    dates.push(d)
  }
  return dates
}

function BookingModal({ doctor, onClose }) {
  const t = useT()
  const [weekBase, setWeekBase] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('patientToken') || sessionStorage.getItem('patientToken')

  const weekDates = getWeekDates(weekBase)
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const isBooked = (date, time) => {
    const key = fmtDate(date)
    return doctor.slots_booked?.[key]?.includes(time)
  }

  const prevWeek = () => {
    const d = new Date(weekBase)
    d.setDate(d.getDate() - 7)
    if (d >= today) setWeekBase(d)
  }

  const nextWeek = () => {
    const d = new Date(weekBase)
    d.setDate(d.getDate() + 7)
    setWeekBase(d)
  }

  const handleBook = async () => {
    if (!token) {
      onClose()
      navigate('/auth', { state: { from: `/doctors/${doctor._id}` } })
      return
    }

    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/appointment/book', {
        docId: doctor._id,
        slotDate: fmtDate(selectedDate),
        slotTime: selectedTime,
      }, { headers: { token } })

      if (data.success) {
        setStep(3)
      } else {
        setError(data.message || t('bookingFailed'))
      }
    } catch {
      setError(t('connectionError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-primary-deep/40 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-border flex items-start justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            {doctor.image ? (
              <img src={doctor.image} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-primary-soft" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary-deep to-primary flex items-center justify-center text-base font-bold text-white">
                {doctor.name?.charAt(0) || 'D'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-text">{doctor.name}</h3>
              <p className="text-xs text-primary font-medium">{doctor.speciality} · {doctor.fees}DA/{t('session')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 border border-border flex items-center justify-center hover:bg-gray-100 transition">
            <X size={15} className="text-muted" />
          </button>
        </div>

        {step < 3 && (
          <div className="px-5 py-3 flex items-center gap-2 border-b border-border">
            {[
              { step: 1, label: t('selectDateTime') },
              { step: 2, label: t('confirmBooking') }
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.step ? 'bg-primary-deep text-white' : step > s.step ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-muted'
                }`}>
                  {step > s.step ? '✓' : s.step}
                </div>
                <span className={`text-xs ${step === s.step ? 'font-semibold text-text' : 'text-muted'}`}>{s.label}</span>
                {i === 0 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>
        )}

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-5 ">
              <div>
                <div className="flex items-center justify-between mb-3 ">
                  <h4 className="text-sm font-semibold text-text flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" /> {t('selectDate')}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button onClick={prevWeek} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
                      <ChevronLeft size={13} className="text-muted" />
                    </button>
                    <span className="text-xs text-sub font-medium w-20 text-center">
                      {MONTHS[weekBase.getMonth()].slice(0, 3)} {weekBase.getFullYear()}
                    </span>
                    <button onClick={nextWeek} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
                      <ChevronRight size={13} className="text-muted" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {weekDates.map((date, i) => {
                    const isPast = date < today
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                    const isToday = date.toDateString() === today.toDateString()
                    return (
                      <button
                        key={i}
                        onClick={() => { if (!isPast) { setSelectedDate(date); setSelectedTime(null) } }}
                        disabled={isPast}
                        className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                          isSelected ? 'bg-accent text-white' : isToday ? 'bg-primary-soft/30' : 'hover:bg-gray-50'
                        } ${isPast ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className="text-[10px] font-medium">{DAYS[date.getDay()]}</span>
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text'}`}>{date.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <h4 className="text-sm font-semibold text-text flex items-center gap-1.5 mb-3">
                    <Clock size={14} className="text-primary" /> {t('selectTime')}
                    <span className="text-xs text-muted font-normal">— {fmtDisplay(selectedDate)}</span>
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(time => {
                      const booked = isBooked(selectedDate, time)
                      const isSelected = selectedTime === time
                      return (
                        <button
                          key={time}
                          onClick={() => { if (!booked) setSelectedTime(time) }}
                          disabled={booked}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected ? 'bg-accent text-white' : booked ? 'bg-gray-100 text-muted line-through cursor-not-allowed' :' hover:bg-gray-50'
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-primary-deep to-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t('continue')} →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-text">{t('confirmDetails')}</h4>
              
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-border">
                {[
                  { icon: User, label: t('doctor'), value: doctor.name },
                  { icon: Stethoscope, label: t('speciality'), value: doctor.speciality },
                  { icon: Calendar, label: t('date'), value: fmtDisplay(selectedDate) },
                  { icon: Clock, label: t('time'), value: selectedTime },
                  { icon: DollarSign, label: t('fee'), value: `${doctor.fees}DA` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary-soft/50 flex items-center justify-center">
                        <Icon size={12} className="text-primary-deep" />
                      </div>
                      <span className="text-xs text-sub">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-text">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-primary-soft/20 rounded-xl p-3 text-xs text-primary-deep leading-relaxed border border-primary/20">
                💡 {t('bookingNotice')}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-500">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setError('') }} className="flex-1 py-3 rounded-xl border border-border text-sub font-medium hover:bg-gray-50 transition">
                  <ArrowLeft size={14} className="inline mr-1" /> {t('back')}
                </button>
                <button onClick={handleBook} disabled={loading} className="flex-1 py-3 rounded-xl bg-linear-to-r from-primary-deep to-primary text-white font-semibold disabled:opacity-50 transition-all">
                  {loading ? t('booking') : (!token ? t('signInToBook') : t('confirmBooking'))}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-text font-serif">{t('bookingSuccess')}</h3>
              <p className="text-sm text-sub">
                {t('bookingSuccessMsg', { name: doctor.name, date: fmtDisplay(selectedDate), time: selectedTime })}
              </p>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-sub font-medium hover:bg-gray-50 transition">
                  {t('close')}
                </button>
                <button onClick={() => { onClose(); navigate('/profile/appointments') }} className="flex-1 py-3 rounded-xl bg-linear-to-r from-primary-deep to-primary text-white font-semibold transition-all">
                  {t('myAppointments')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DoctorDetailsPage() {
  const { docId } = useParams()
  const t = useT()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    api.get(`/api/doctor/${docId}`)
      .then(({ data }) => {
        if (data.success && data.data) {
          setDoctor(data.data)
        } else {
          navigate('/doctors')
        }
      })
      .catch(() => navigate('/doctors'))
      .finally(() => setLoading(false))
  }, [docId, navigate])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-border border-t-primary rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  if (!doctor) return null

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back button */}
          <button
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-sub hover:text-primary transition mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            {t('backToDoctors')}
          </button>

          {/* Doctor Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image & Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border sticky top-28">
                <div className="aspect-square overflow-hidden">
                  {doctor.image ? (
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary-soft to-primary flex items-center justify-center text-6xl font-bold text-white">
                      {doctor.name?.charAt(0) || 'D'}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-text mb-1">{doctor.name}</h1>
                  <p className="text-primary font-medium mb-4">{doctor.speciality}</p>
                  <button
                    onClick={() => setShowBookingModal(true)}

                    className={` w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      doctor.available
                        ? ' btn-primary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                        : 'bg-gray-100 text-muted cursor-not-allowed'
                    }`}
                  >
                    {doctor.available ? t('bookAppointment') : t('unavailable')}
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-text mb-3 flex items-center gap-2">
                  <Heart size={20} className="text-primary" /> {t('aboutDoctor')}
                </h2>
                <p className="text-sub leading-relaxed">
                  {doctor.about || t('noBio')}
                </p>
              </div>

              {/* Education & Credentials */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                  <Award size={20} className="text-primary" /> {t('credentials')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.degree && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <GraduationCap size={18} className="text-primary" />
                      <div>
                        <p className="text-xs text-muted">{t('degree')}</p>
                        <p className="font-medium text-text">{doctor.degree}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Briefcase size={18} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted">{t('experience')}</p>
                      <p className="font-medium text-text">{doctor.experience} {t('years')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Stethoscope size={18} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted">{t('speciality')}</p>
                      <p className="font-medium text-text">{doctor.speciality}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <DollarSign size={18} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted">{t('feePerSession')}</p>
                      <p className="font-medium text-text">{doctor.fees}DA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              {doctor.address && (doctor.address.line1 || doctor.address.line2) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="text-xl font-bold text-text mb-3 flex items-center gap-2">
                    <MapPin size={20} className="text-primary" /> {t('location')}
                  </h2>
                  <p className="text-sub">
                    {doctor.address.line1}
                    {doctor.address.line2 && <>, {doctor.address.line2}</>}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showBookingModal && (
        <BookingModal doctor={doctor} onClose={() => setShowBookingModal(false)} />
      )}
    </>
  )
}