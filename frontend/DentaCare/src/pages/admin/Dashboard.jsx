import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Stethoscope, Calendar, Clock, DollarSign, Activity, Ban, ArrowRight, CalendarDays } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { StatCard, Badge, EmptyState, Modal } from '../../components/ui/components'
import useAdminStore from '../../store/adminStore'
import useT from '../../hooks/useT'
import api from '../../lib/axios'
import { PageLoader } from '../../components/ui/Skeleton';

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

  if (loading) return <PageLoader />

  const s = stats

  return (
    <div className="flex flex-col gap-5 animate-fade-in mt-8">
      
      {/* MAIN TOP GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* FULL WIDTH HERO CARD */}
        <div className="card p-6 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-border rounded-xl shadow-xs">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep tracking-tight">
              {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 bg-bg/50 border border-border/40 rounded-xl p-3.5 sm:min-w-[220px]">
            <div className="inline-flex items-center justify-center bg-accent-soft text-primary-hov font-bold h-9 px-3 rounded-lg text-base shadow-2xs">
              {s?.appointments?.today ?? 0}
            </div>
            <p className="text-xs text-text font-medium leading-tight">
              {t('upcomingToday') || 'appointments scheduled for today'}
            </p>
          </div>
        </div>

        {/* STAT CARDS */}
        <StatCard
          title={t('totalDoctors')} value={s?.doctors?.total ?? 0}
          icon={Stethoscope} trend={`${s?.doctors?.available ?? 0} ${t('available')}`}
          color="accentSoft"
        />
        <StatCard
          title={t('totalPatients')} value={s?.patients?.total ?? 0}
          icon={User} trend={t('registered')}
          color="success"
        />
        <StatCard
          title={t('totalAppointments')} value={s?.appointments?.total ?? 0}
          icon={CalendarDays} trend={`${s?.appointments?.today ?? 0} ${t('today')}`}
          color="accent"
        />
      </div>

      {/* ANALYTICS CHART */}
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

      {/* APPOINTMENTS DATA CONTAINER */}
      <div className="card overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-border bg-white">
          <h3 className="section-title">{t('recentAppointments')}</h3>
          <Link to="/admin/appointments" className="text-xs text-primary no-underline hover:underline flex items-center gap-1">
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
                  <th className="text-left  text-[10px] font-bold text-muted px-4 py-3 w-10">#</th>
                  {[
                    { label: t('patient'), icon: User },
                    { label: t('doctor'), icon: Stethoscope },
                    { label: t('date'), icon: Calendar },
                    { label: t('time'), icon: Clock },
                    { label: t('amount'), icon: DollarSign },
                    { label: t('status'), icon: Activity },
                    { label: t('actions'), icon: null }
                  ].map((h, idx) => (
                    <th key={idx} className="text-left text-[14px] font-light text-primary-hov  px-4 py-3 whitespace-nowrap">
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
                          <p className="text-[10px] text-muted  mt-0.5">{a.docData?.speciality}</p>
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
                      {a.amount}DA
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