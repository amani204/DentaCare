import { useEffect, useState } from 'react'
import { Search, User, Calendar, Clock, DollarSign, CreditCard, Activity, CheckCircle, XCircle, Ban } from 'lucide-react'
import { Badge, Loader } from '../../components/common/components'
import useDoctorStore from '../../store/doctorStore'
import useT from '../../hooks/useT'
import api from '../../lib/axios'

const FILTERS = ['all', 'upcoming', 'completed', 'cancelled']

export default function DoctorAppointments() {
  const { dToken, lang } = useDoctorStore()
  const t = useT()

  const [apts, setApts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [completing, setCompleting] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const fetchApts = async () => {
    try {
      const { data } = await api.get('/api/doctor/appointments', { headers: { dtoken: dToken } })
      if (data.success) setApts(data.appointments)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleComplete = async (id) => {
    setCompleting(id)
    try {
      const { data } = await api.post('/api/doctor/complete', { appointmentId: id }, { headers: { dtoken: dToken } })
      if (data.success) fetchApts()
    } catch (e) { console.error(e) }
    finally { setCompleting(null) }
  }

  const handleCancel = async (id) => {
    setCancelling(id)
    try {
      const { data } = await api.post('/api/doctor/cancel', { appointmentId: id }, { headers: { dtoken: dToken } })
      if (data.success) fetchApts()
    } catch (e) { console.error(e) }
    finally { setCancelling(null) }
  }

  useEffect(() => { fetchApts() }, [])

  const getStatus = (a) => a.cancelled ? 'cancelled' : a.isCompleted ? 'completed' : a.isPaid ? 'paid' : 'pending'

  const counts = {
    all: apts.length,
    upcoming: apts.filter(a => !a.isCompleted && !a.cancelled).length,
    completed: apts.filter(a => a.isCompleted).length,
    cancelled: apts.filter(a => a.cancelled).length,
  }

  const filtered = apts.filter(a => {
    const matchFilter =
      filter === 'all' ? true :
      filter === 'completed' ? a.isCompleted :
      filter === 'cancelled' ? a.cancelled :
      filter === 'upcoming' ? (!a.isCompleted && !a.cancelled) : true
    const matchSearch = !search || a.userData?.name?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const headers = [
    { key: '#', icon: null, label: '#' },
    { key: 'patient', icon: User, label: t('patient') },
    { key: 'date', icon: Calendar, label: t('date') },
    { key: 'time', icon: Clock, label: t('time') },
    { key: 'amount', icon: DollarSign, label: t('amount') },
    { key: 'payment', icon: CreditCard, label: t('payment') },
    { key: 'status', icon: Activity, label: t('status') },
    { key: 'actions', icon: null, label: t('actions') },
  ]

  if (loading) return <Loader fullScreen />

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-text">{t('allApts')}</h2>
          <p className="text-sm text-sub">{apts.length} {t('total')}</p>
        </div>

        <div className="flex gap-0.5 p-0.5 rounded-lg bg-bg border border-border">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-sub hover:text-text hover:bg-bg/80'
              }`}
            >
              {t(f)}
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                filter === f
                  ? 'bg-white/20 text-white'
                  : 'bg-border text-sub'
              }`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input pl-9"
          placeholder={t('searchPatient')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted">{t('noApts')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-primary/5">
                  {headers.map(({ key, icon: Icon, label }) => (
                    <th key={key} className="text-left text-xs font-semibold text-primary-deep uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {Icon && <Icon size={12} />}
                        {label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a._id || i} className="border-b border-border hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted font-medium">{i + 1}</td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary-deep flex-shrink-0">
                          {a.userData?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text">{a.userData?.name || '—'}</p>
                          {a.userData?.email && <p className="text-xs text-muted">{a.userData.email}</p>}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-sub whitespace-nowrap">
                      {a.slotDate?.replace(/_/g, '/')}
                    </td>

                    <td className="px-4 py-3 text-sm text-sub whitespace-nowrap">
                      {a.slotTime}
                    </td>

                    <td className="px-4 py-3 text-sm font-bold text-primary whitespace-nowrap">
                      ${a.amount}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge status={a.isPaid ? 'paid' : 'unpaid'} />
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge status={getStatus(a)} />
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {!a.cancelled && !a.isCompleted ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleComplete(a._id)}
                            disabled={completing === a._id}
                            className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all"
                          >
                            {completing === a._id ? '...' : t('completeBtn')}
                          </button>
                          <button
                            onClick={() => handleCancel(a._id)}
                            disabled={cancelling === a._id}
                            className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-500 rounded-lg border border-red-200 hover:bg-red-100 transition-all"
                          >
                            {cancelling === a._id ? '...' : t('cancelBtn')}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
