import { useEffect, useState } from 'react'
import { 
  Search, X, User, Calendar, Clock, DollarSign, 
  CreditCard, Activity, XCircle, CheckCircle, Clock3, 
  Filter, Ban, Phone, Mail
} from 'lucide-react'
import { Badge, EmptyState, Modal, MiniStat } from '../../components/ui/components'
import useDoctorStore from '../../store/doctorStore'
import api from '../../lib/axios'
import useT from '../../hooks/useT'
import { PageLoader } from '../../components/ui/Skeleton'

const FILTERS = ['all', 'pending', 'completed', 'cancelled']

export default function DoctorAppointments() {
  const { dToken } = useDoctorStore()
  const t = useT()

  const [apts, setApts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [completing, setCompleting] = useState(null)
  const [cancelling, setCancelling] = useState(false) // Changed to boolean for modal state
  const [cancelId, setCancelId] = useState(null)

  const fetchApts = async () => {
    try {
      const { data } = await api.get('/doctor/appointments', { headers: { dtoken: dToken } })
      if (data.success) {
        const sorted = data.appointments.sort((a, b) => {
          const dateA = a.slotDate.split('_').reverse().join('-')
          const dateB = b.slotDate.split('_').reverse().join('-')
          return dateB.localeCompare(dateA)
        })
        setApts(sorted)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleComplete = async (id) => {
    setCompleting(id)
    try {
      const { data } = await api.post('/doctor/complete', { appointmentId: id }, { headers: { dtoken: dToken } })
      if (data.success) fetchApts()
    } catch (e) { console.error(e) }
    finally { setCompleting(null) }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const { data } = await api.post('/doctor/cancel', { appointmentId: cancelId }, { headers: { dtoken: dToken } })
      if (data.success) { setCancelId(null); fetchApts() }
    } catch (e) { console.error(e) }
    finally { setCancelling(false) }
  }

  useEffect(() => { fetchApts() }, [])

  const getStatus = (a) => a.cancelled ? 'cancelled' : a.isCompleted ? 'completed' : a.isPaid ? 'paid' : 'pending'

  const counts = {
    all: apts.length,
    pending: apts.filter(a => !a.isCompleted && !a.cancelled).length,
    completed: apts.filter(a => a.isCompleted).length,
    cancelled: apts.filter(a => a.cancelled).length,
  }

  const filtered = apts.filter(a => {
    const matchFilter = filter === 'all' ||
      (filter === 'completed' && a.isCompleted) ||
      (filter === 'cancelled' && a.cancelled) ||
      (filter === 'pending' && !a.isCompleted && !a.cancelled)
    const matchSearch = !search ||
      a.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.userData?.phone?.includes(search) ||
      a.userData?.email?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const headers = [
    { key: '#', icon: null, label: '#' },
    { key: 'patient', icon: User, label: t('patient') },
    { key: 'contact', icon: Phone, label: t('contact') },
    { key: 'date', icon: Calendar, label: t('date') },
    { key: 'time', icon: Clock, label: t('time') },
    { key: 'amount', icon: DollarSign, label: t('amount') },
    { key: 'payment', icon: CreditCard, label: t('paymentStatus') },
    { key: 'status', icon: Activity, label: t('status') },
    { key: 'actions', icon: null, label: t('actions') },
  ]

  if (loading) return <PageLoader />

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      
      {/* MATCHED HERO HEADER */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-border rounded-xl shadow-xs">
        <div>
          <h2 className="text-[20px] font-bold text-primary-deep ">
            {t('allAppointments')}
          </h2>
        </div>
        <div className="flex items-center gap-3 bg-bg/50 border border-border/40 rounded-xl p-3 px-4">
          <p className="text-xs text-sub font-medium leading-tight text-right">
            {apts.length} {t('total')} {t('appointments') || 'appointments logged.'}
          </p>
        </div>
      </div>

      {/* Control Center */}
      <div className="flex flex-col gap-6 bg-white p-5 rounded-2xl border border-border shadow-sm mb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat title={t('total')} value={counts.all} color="success" />
          <MiniStat title={t('pending')} value={counts.pending} color="primary" />
          <MiniStat title={t('completed')} value={counts.completed} color="accentSoft" />
          <MiniStat title={t('cancelled')} value={counts.cancelled} color="accent" />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between pt-4 border-t border-dashed border-border">
          <div className="flex bg-bg p-1 rounded-xl border border-border w-full lg:w-auto overflow-x-auto">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-white text-primary shadow-sm border border-border/50'
                    : 'text-sub hover:text-text'
                }`}
              >
                {f === 'all' && <Filter size={14} />}
                {f === 'pending' && <Clock3 size={14} />}
                {f === 'completed' && <CheckCircle size={14} />}
                {f === 'cancelled' && <XCircle size={14} />}
                {t(f)}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === f ? 'bg-primary/10 text-primary' : 'bg-border text-sub'
                }`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input pl-9 border-gray-200 transition-all w-full"
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-red-500">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center"><EmptyState message={t('noAppointments')} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg/50">
                  {headers.map(({ key, icon: Icon, label }) => (
                    <th key={key} className="text-left text-[14px] font-light text-primary-hov px-4 py-3 whitespace-nowrap">
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
                  <tr key={a._id || i} className="table-row border-b border-border hover:bg-bg/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{i + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent-soft flex items-center justify-center text-xs font-bold text-primary-hov shrink-0">
                          {a.userData?.name?.charAt(0) || 'P'}
                        </div>
                        <span className="text-sm font-medium text-text">{a.userData?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-xs text-sub"><Phone size={12} /> {a.userData?.phone || '—'}</div>
                        <div className="flex items-center gap-1 text-xs text-sub"><Mail size={12} /> {a.userData?.email || '—'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-sub whitespace-nowrap">{a.slotDate?.replace(/_/g, '/')}</td>
                    <td className="px-4 py-3 text-sm text-sub whitespace-nowrap">{a.slotTime}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary whitespace-nowrap">{a.amount}DA</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!a.isCompleted && <Badge status={a.isPaid ? 'paid' : 'unpaid'} />}
                      {a.isCompleted && <span className="text-muted text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge status={getStatus(a)} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!a.cancelled && !a.isCompleted ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleComplete(a._id)} disabled={completing === a._id} className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-all" title={t('completeBtn')}>
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => setCancelId(a._id)} className="text-red-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all" title={t('cancelBtn')}>
                            <Ban size={16} />
                          </button>
                        </div>
                      ) : <span className="text-muted text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title={t('cancelAppt')}
        message={t('cancelApptMsg')}
        confirmText={t('yesCancel')}
        cancelText={t('cancel')}
        type="danger"
        loading={cancelling}
      />
    </div>
  )
}