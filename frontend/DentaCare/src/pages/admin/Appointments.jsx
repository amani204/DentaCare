import { useEffect, useState } from 'react'
import { 
  Search, X, User, Stethoscope, Calendar, Clock, DollarSign, 
  CreditCard, Activity, XCircle, CheckCircle, Clock3, 
  Filter, Ban
} from 'lucide-react'
import { Badge, Loader, EmptyState, Modal, MiniStat } from '../../components/common/components'
import useAdminStore from '../../store/adminStore'
import useT from '../../hooks/useT'
import api from '../../lib/axios'

const FILTERS = ['all', 'pending', 'completed', 'cancelled']

export default function Appointments() {
  const { aToken } = useAdminStore()
  const t = useT()

  const [apts, setApts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [cancelId, setCancelId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const fetch = async () => {
    try {
      const { data } = await api.get('/api/admin/appointments', { headers: { atoken: aToken } })
      if (data.success) setApts(data.appointments)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const { data } = await api.post('/api/admin/cancel', { appointmentId: cancelId }, { headers: { atoken: aToken } })
      if (data.success) { setCancelId(null); fetch() }
    } catch (e) { console.error(e) }
    finally { setCancelling(false) }
  }

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
      a.docData?.name?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const headers = [
    { key: '#', icon: null, label: '#' },
    { key: 'patient', icon: User, label: t('patient') },
    { key: 'doctor', icon: Stethoscope, label: t('doctor') },
    { key: 'date', icon: Calendar, label: t('date') },
    { key: 'time', icon: Clock, label: t('time') },
    { key: 'amount', icon: DollarSign, label: t('amount') },
    { key: 'payment', icon: CreditCard, label: t('paymentStatus') },
    { key: 'status', icon: Activity, label: t('status') },
    { key: 'actions', icon: null, label: t('actions') },
  ]

  if (loading) return <Loader fullScreen />

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-title">{t('allAppointments')}</h2>
          <p className="sub-text">{apts.length} {t('total')}</p>
        </div>
      </div>

      {/* Appointments Control Center */}
  <div className="flex flex-col gap-6 bg-white p-5 rounded-2xl border border-border shadow-sm mb-2">
      
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <MiniStat
      title={t('total')}
      value={counts.all}
      color="success"
    />
    <MiniStat
      title={t('pending')}
     value={counts.pending}
      color="primary"
    />
    <MiniStat
      title={t('completed')}
      value={counts.completed}
      color="accentSoft"
    />
    <MiniStat
      title={t('cancelled')}
      value={counts.cancelled}
      color="accent"
    />
  </div>
        {/* Tabs and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between pt-4 border-t border-dashed border-border">
          
          {/* Segmented Filter Tabs */}
          <div className="flex bg-bg p-1 rounded-xl border border-border w-full lg:w-auto overflow-x-auto">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
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

          {/* Modern Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input pl-9 bg-bg/50 border-none focus:bg-white transition-all w-full"
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <EmptyState message={t('noAppointments')} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg/50">
                  {headers.map(({ key, icon: Icon, label }) => (
                    <th
                      key={key}
                      className="text-left text-xs text-primary-hov uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                    >
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
                    
                    {/* Patient */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent-soft flex items-center justify-center text-xs font-bold text-primary-hov shrink-0">
                          {a.userData?.name?.charAt(0) || 'P'}
                        </div>
                        <span className="text-sm font-medium text-text">{a.userData?.name || '—'}</span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {a.docData?.image ? (
                          <img src={a.docData.image} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary-hov shrink-0">
                            {a.docData?.name?.charAt(0) || 'D'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-text leading-tight">{a.docData?.name}</p>
                          <p className="text-[10px] text-muted uppercase tracking-tighter">{a.docData?.speciality}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-sub whitespace-nowrap">{a.slotDate?.replace(/_/g, '/')}</td>
                    <td className="px-4 py-3 text-sm text-sub whitespace-nowrap">{a.slotTime}</td>
                    <td className="px-4 py-3 text-sm  text-primary whitespace-nowrap">${a.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge status={a.isPaid ? 'paid' : 'unpaid'} /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge status={getStatus(a)} /></td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!a.cancelled && !a.isCompleted ? (
                        <button
                          onClick={() => setCancelId(a._id)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                          title={t('cancelBtn')}
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
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