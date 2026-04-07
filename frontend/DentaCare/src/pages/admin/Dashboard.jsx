import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Stethoscope, Calendar, Clock, DollarSign, Activity,Ban, ArrowRight, CalendarDays, TrendingUp } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { StatCard, Badge, Loader, EmptyState, Modal } from '../../components/common/components'
import useAdminStore from '../../store/adminStore'
import useT from '../../hooks/useT'
import api from '../../lib/axios'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const BAR_COLORS = { Completed: '#94d7bc', Pending: '#cde9ff', Cancelled: '#f3afb8' }
const BAR_COLORS_FR = { Terminés: '#94d7bc', 'En attente': '#cde9ff', Annulés: '#f3afb8' }

export default function Dashboard() {
  const { aToken, lang } = useAdminStore()
  const t = useT()

  const [stats, setStats] = useState(null)
  const [apts, setApts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const fetchAll = async () => {
    try {
      const [d, a] = await Promise.all([
        api.get('/admin/dashboard', { headers: { atoken: aToken } }),
        api.get('/admin/appointments', { headers: { atoken: aToken } }),
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
      const { data } = await api.post('/admin/cancel', { appointmentId: cancelId }, { headers: { atoken: aToken } })
      if (data.success) { setCancelId(null); fetchAll() }
    } catch (e) { console.error(e) }
    finally { setCancelling(false) }
  }

  const getStatus = (a) => a.cancelled ? 'cancelled' : a.isCompleted ? 'completed' : a.isPaid ? 'paid' : 'pending'

  const gridColor = '#DDE6F5'

  const mNames = lang === 'fr' ? monthsFr : months
  const revenueData = stats?.revenue?.monthly && stats.revenue.monthly.length > 0
    ? stats.revenue.monthly.map((v, i) => ({ month: mNames[i], revenue: v }))
    : mNames.slice(0, 6).map((m) => ({ month: m, revenue: 0 }))

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
    <div className="flex flex-col gap-5 animate-fade-in mt-8">
      <div>
        <h2 className="text-3xl font-bold text-primary-deep mb-2">
          {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
        <p className="sub-text">
          <span className="text-text font-semibold">{s?.appointments?.today ?? 0}</span>
          {' '}{t('upcomingToday')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title={t('totalDoctors')} value={s?.doctors?.total ?? 0}
          icon={Stethoscope} trend={`${s?.doctors?.available ?? 0} ${t('available')}`}
          color="success"
        />
        <StatCard
          title={t('totalPatients')} value={s?.patients?.total ?? 0}
          icon={User} trend="registered"
          color="accent"
        />
        <StatCard
          title={t('totalAppointments')} value={s?.appointments?.total ?? 0}
          icon={CalendarDays} trend={`${s?.appointments?.today ?? 0} ${t('today')}`}
          color="primary"
        />
        <StatCard
          title={t('totalRevenue')} value={`$${(s?.revenue?.total ?? 0).toLocaleString()}`}
          icon={DollarSign} trend={`${s?.revenue?.paidAppointments ?? 0} ${t('paid')}`}
          color="accentSoft"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3.5">

        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">{t('monthlyRevenue')}</h3>
            <span className="badge badge-primary">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="primary" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="primary" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#2C2C2A" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#2C2C2A"  }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} 
                domain={[0, 'auto']} />
              <Tooltip content={<RevenueTooltip />} />
              <Area
                type="monotone" dataKey="revenue"
                stroke="#2C2C2A" strokeWidth={2.5}
                fill="url(#blueGrad)"
                dot={{ fill: '#2C2C2A', strokeWidth: 0, r: 3.5 }}
                activeDot={{ r: 5, fill: '#2C2C2A' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">{t('appointmentStats')}</h3>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={apptData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={34}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#2C2C2A" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#2C2C2A" }} axisLine={false} tickLine={false} />
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

<div className="card overflow-hidden">
  <div className="flex justify-between items-center p-5 border-b border-border bg-white">
    <h3 className="section-title">{t('recentAppointments')}</h3>
    <Link to="/appointments" className="text-xs text-accent no-underline hover:underline flex items-center gap-1">
      {t('viewAll')} <ArrowRight size={14} />
    </Link>
  </div>

  {apts.length === 0 ? (
    <div className="p-10">
      <EmptyState message={t('noAppointments')} icon={CalendarDays} />
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-bg/40">
            <th className="text-left  text-[10px] font-bold text-muted uppercase tracking-widest px-4 py-3 w-10">#</th>
            {[
              { label: t('patient'), icon: User },
              { label: t('doctor'), icon: Stethoscope },
              { label: t('date'), icon: Calendar },
              { label: t('time'), icon: Clock },
              { label: t('amount'), icon: DollarSign },
              { label: t('status'), icon: Activity },
              { label: t('actions'), icon: null }
            ].map((h, idx) => (
              <th key={idx} className="text-left text-[10px]  text-primary-hov uppercase tracking-widest px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {h.icon && <h.icon size={12} />}
                  {h.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {apts.map((a, i) => (
            <tr key={a._id || i} className="group border-b border-border last:border-0 hover:bg-bg/20 transition-colors">
              <td className="px-4 py-4 text-xs text-muted font-semibold">{i + 1}</td>
              
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-xs font-bold text-primary-hov shrink-0 border border-accent-soft/10">
                    {a.userData?.name?.charAt(0) || 'P'}
                  </div>
                  <span className="text-sm  text-text">
                    {a.userData?.name || '—'}
                  </span>
                </div>
               </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {a.docData?.image ? (
                    <img src={a.docData.image} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs  text-slate-500">
                      {a.docData?.name?.charAt(0) || 'D'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm  text-text leading-tight">{a.docData?.name}</p>
                    <p className="text-[10px] text-muted uppercase tracking-tighter mt-0.5">{a.docData?.speciality}</p>
                  </div>
                </div>
               </td>

              <td className="px-4 py-4 text-sm text-sub font-medium whitespace-nowrap">
                {a.slotDate?.replace(/_/g, '/')}
               </td>
              <td className="px-4 py-4 text-sm text-sub font-medium whitespace-nowrap">
                {a.slotTime}
               </td>

              <td className="px-4 py-4 text-sm text-primary whitespace-nowrap">
                ${a.amount}
               </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <Badge status={getStatus(a)} />
               </td>

              <td className="px-4 py-4 whitespace-nowrap">
                {!a.cancelled && !a.isCompleted ? (
                  <button
                    onClick={() => setCancelId(a._id)}
                    className="text-sub hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title={t('cancelBtn')}
                  >
                    <Ban size={16} />
                  </button>
                ) : (
                  <span className="text-muted text-xs font-medium px-2">—</span>
                )}
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