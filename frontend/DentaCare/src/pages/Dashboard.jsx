
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Stethoscope, Users, CalendarDays, DollarSign, TrendingUp, 
  XCircle,
  ArrowRight, BarChart3, AreaChart as AreaChartIcon
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { StatCard, Badge, Loader, EmptyState, Modal } from '../components/common/components'
import useAdminStore from '../store/adminStore'
import useT from '../hooks/useT'
import api from '../lib/axios'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const BAR_COLORS = { Completed: '#16A34A', Pending: '#D97706', Cancelled: '#EF4444' }
const BAR_COLORS_FR = { Terminés: '#16A34A', 'En attente': '#D97706', Annulés: '#EF4444' }

export default function Dashboard() {
  const { aToken, theme, lang } = useAdminStore()
  const t = useT()

  const [stats, setStats] = useState(null)
  const [apts, setApts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const fetchAll = async () => {
    try {
      const [d, a] = await Promise.all([
        api.get('/api/admin/dashboard', { headers: { atoken: aToken } }),
        api.get('/api/admin/appointments', { headers: { atoken: aToken } }),
      ])
      if (d.data.success) setStats(d.data.dashboard)
      if (a.data.success) setApts(a.data.appointments.slice(0, 6))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const { data } = await api.post('/api/admin/cancel', { appointmentId: cancelId }, { headers: { atoken: aToken } })
      if (data.success) { setCancelId(null); fetchAll() }
    } catch (e) { console.error(e) }
    finally { setCancelling(false) }
  }

  const getStatus = (a) => a.cancelled ? 'cancelled' : a.isCompleted ? 'completed' : a.isPaid ? 'paid' : 'pending'

  const textColor = '#4A6094'
  const gridColor = '#DDE6F5'

  const mNames = lang === 'fr' ? monthsFr : months
  const revenueData = stats?.revenue?.monthly
    ? stats.revenue.monthly.map((v, i) => ({ month: mNames[i], revenue: v }))
    : mNames.slice(0, 6).map((m, i) => ({ month: m, revenue: [8000, 11000, 14000, 12000, 16000, 13000][i] }))

  const apptData = lang === 'fr'
    ? [
        { name: 'Terminés', value: stats?.appointments?.completed ?? 0 },
        { name: 'En attente', value: stats?.appointments?.pending ?? 0 },
        { name: 'Annulés', value: stats?.appointments?.cancelled ?? 0 },
      ]
    : [
        { name: 'Completed', value: stats?.appointments?.completed ?? 0 },
        { name: 'Pending', value: stats?.appointments?.pending ?? 0 },
        { name: 'Cancelled', value: stats?.appointments?.cancelled ?? 0 },
      ]

  const colorMap = lang === 'fr' ? BAR_COLORS_FR : BAR_COLORS

  const RevenueTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-card text-sm">
        <p className="font-semibold text-text mb-0.5">{label}</p>
        <p className="text-primary font-bold">${payload[0].value?.toLocaleString()}</p>
      </div>
    )
  }

  if (loading) return <Loader fullScreen />

  const s = stats

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* Welcome banner */}
      <div className="card p-5 flex items-center justify-between bg-linear-to-r from-primary-soft/50 to-surface border border-primary/20">
        <div>
          <h2 className="text-lg font-bold text-primary-deep mb-1">
            {t('welcome')} 
          </h2>
          <p className="sub-text">
            <span className="text-primary font-semibold">{s?.appointments?.today ?? 0}</span>
            {' '}{t('upcomingToday')}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp size={24} className="text-primary-deep" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title={t('totalDoctors')} value={s?.doctors?.total ?? 0}
          icon={Stethoscope} trend={`${s?.doctors?.available ?? 0} ${t('available')}`}
          color="primary"
        />
        <StatCard
          title={t('totalPatients')} value={s?.patients?.total ?? 0}
          icon={Users} trend="registered"
          color="info"
        />
        <StatCard
          title={t('totalAppointments')} value={s?.appointments?.total ?? 0}
          icon={CalendarDays} trend={`${s?.appointments?.today ?? 0} ${t('today')}`}
          color="success"
        />
        <StatCard
          title={t('totalRevenue')} value={`$${(s?.revenue?.total ?? 0).toLocaleString()}`}
          icon={DollarSign} trend={`${s?.revenue?.paidAppointments ?? 0} ${t('paid')}`}
          color="accent"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3.5">

        {/* Revenue area chart */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">{t('monthlyRevenue')}</h3>
            <span className="badge badge-primary">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7097D2" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#7097D2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<RevenueTooltip />} />
              <Area
                type="monotone" dataKey="revenue"
                stroke="#7097D2" strokeWidth={2.5}
                fill="url(#blueGrad)"
                dot={{ fill: '#7097D2', strokeWidth: 0, r: 3.5 }}
                activeDot={{ r: 5, fill: '#091E5D' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment stats bar chart */}
        <div className="card p-5">
          <h3 className="section-title mb-4">{t('appointmentStats')}</h3>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={apptData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={34}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  fontSize: '0.8125rem',
                }}
                cursor={{ fill: 'rgba(112,151,210,0.06)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {apptData.map((entry, i) => (
                  <Cell key={i} fill={colorMap[entry.name] || '#7097D2'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent appointments */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-title">{t('recentAppointments')}</h3>
          <Link to="/appointments" className="text-xs text-primary font-medium no-underline hover:underline flex items-center gap-1">
            {t('viewAll')} <ArrowRight size={12} />
          </Link>
        </div>

        {apts.length === 0 ? (
          <EmptyState message={t('noAppointments')} icon={CalendarDays} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {[t('patient'), t('doctor'), t('date'), t('time'), t('amount'), t('status'), t('actions')].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted uppercase tracking-wide px-2 pb-2.5">
                      {h}
                    </th>
                  ))}
                 </tr>
              </thead>
              <tbody>
                {apts.map((a, i) => (
                  <tr key={a._id || i} className="border-b border-border hover:bg-bg/50 transition-colors">
                    {/* Patient */}
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary-deep shrink-0">
                          {a.userData?.name?.charAt(0) || 'P'}
                        </div>
                        <span className="text-sm font-medium text-text">
                          {a.userData?.name || '—'}
                        </span>
                      </div>
                     </td>

                    {/* Doctor */}
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1.5">
                        {a.docData?.image && (
                          <img src={a.docData.image} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-text leading-tight">{a.docData?.name}</p>
                          <p className="text-xs text-muted">{a.docData?.speciality}</p>
                        </div>
                      </div>
                     </td>

                    {/* Date */}
                    <td className="px-2 py-3 text-sm text-sub">
                      {a.slotDate?.replace(/_/g, '/')}
                     </td>

                    {/* Time */}
                    <td className="px-2 py-3 text-sm text-sub">{a.slotTime}</td>

                    {/* Amount */}
                    <td className="px-2 py-3 text-sm font-semibold text-primary">${a.amount}</td>

                    {/* Status */}
                    <td className="px-2 py-3"><Badge status={getStatus(a)} /></td>

                    {/* Actions */}
                    <td className="px-2 py-3">
                      {!a.cancelled && !a.isCompleted && (
                        <button
                          onClick={() => setCancelId(a._id)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                          title={t('cancelBtn')}
                        >
                          <XCircle size={16} />
                        </button>
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