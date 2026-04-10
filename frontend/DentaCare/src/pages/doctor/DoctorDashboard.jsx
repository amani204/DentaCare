import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle, DollarSign, Clock, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import useDoctorStore from '../../store/doctorStore'
import api from '../../lib/axios'
import { StatCard, Badge } from '../../components/ui/components'
import useT from '../../hooks/useT'
import { PageLoader } from '../../components/ui/Skeleton'
import useAdminStore from '../../store/adminStore'

export default function DoctorDashboard() {
  const { dToken, doctor} = useDoctorStore()
  const {  lang } = useAdminStore()
  const t = useT()

  const [dashboard, setDashboard] = useState(null)
  const [allApts, setAllApts] = useState([])
  const [todayApts, setTodayApts] = useState([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const fetchAll = async () => {
    try {
      const [dashRes, aptsRes] = await Promise.all([
        api.get('/doctor/dashboard', { headers: { dtoken: dToken } }),
        api.get('/doctor/appointments', { headers: { dtoken: dToken } }),
      ])
      if (dashRes.data.success) setDashboard(dashRes.data.dashboard)
      if (aptsRes.data.success) {
        const apts = aptsRes.data.appointments
        setAllApts(apts)
        const today = new Date()
        const todayStr = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`
        setTodayApts(apts.filter(a => a.slotDate === todayStr && !a.cancelled))
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleComplete = async (id) => {
    setCompleting(id)
    try {
      const { data } = await api.post('/doctor/complete', { appointmentId: id }, { headers: { dtoken: dToken } })
      if (data.success) fetchAll()
    } catch (e) { console.error(e) }
    finally { setCompleting(null) }
  }

  const handleCancel = async (id) => {
    setCancelling(id)
    try {
      const { data } = await api.post('/doctor/cancel', { appointmentId: id }, { headers: { dtoken: dToken } })
      if (data.success) fetchAll()
    } catch (e) { console.error(e) }
    finally { setCancelling(null) }
  }

  useEffect(() => { fetchAll() }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening')

  // Appointment status data for bar chart
  const apptData = lang === 'fr'
    ? [
        { name: 'Terminés', value: dashboard?.stats?.completedAppointments ?? 0, color: '#94d7bc' },
        { name: 'En attente', value: dashboard?.stats?.pendingAppointments ?? 0, color: '#cde9ff' },
        { name: 'Annulés', value: dashboard?.stats?.cancelledAppointments ?? 0, color: '#f3afb8' },
      ]
    : [
        { name: 'Completed', value: dashboard?.stats?.completedAppointments ?? 0, color: '#94d7bc' },
        { name: 'Pending', value: dashboard?.stats?.pendingAppointments ?? 0, color: '#cde9ff' },
        { name: 'Cancelled', value: dashboard?.stats?.cancelledAppointments ?? 0, color: '#f3afb8' },
      ]


  const getStatus = (a) => a.cancelled ? 'cancelled' : a.isCompleted ? 'completed' : a.isPaid ? 'paid' : 'pending'

  const recentApts = allApts.slice(0, 5)
  const d = dashboard?.stats

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mt-8">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            {greeting}, Dr. {doctor?.name?.split(' ')[1] || 'Doctor'}
          </h2>
          <p className="text-sub text-sm">
            <span className="text-primary font-semibold">{todayApts.length}</span>
            {' '}{t('appointmentsToday')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-primary-soft/50 rounded-xl border border-primary-soft/50">
            <p className="text-xl font-bold text-primary-deep">{todayApts.filter(a => !a.isCompleted).length}</p>
            <p className="text-xs text-sub">{t('remaining')}</p>
          </div>
          <div className="text-center px-4 py-2 bg-accent-soft/50 rounded-xl border border-accent-soft/50">
            <p className="text-xl font-bold text-emerald-600">{todayApts.filter(a => a.isCompleted).length}</p>
            <p className="text-xs text-sub">{t('done')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title={t('totalAppointments')} value={d?.totalAppointments ?? 0} icon={CalendarDays} trend={t('allTime')} color="accent" />
        <StatCard title={t('completedApts')} value={d?.completedAppointments ?? 0} icon={CheckCircle} trend={t('fromCompleted')} color="success" />
        <StatCard title={t('upcomingApts')} value={d?.pendingAppointments ?? 0} icon={Clock} trend={t('$scheduled')} color="purple" />
        <StatCard title={t('totalEarnings')} value={`$${(d?.totalEarnings ?? 0).toLocaleString()}`} icon={DollarSign} trend={t('fromCompleted')} color="accentSoft" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
        <div className="bg-white/80 backdrop-blur-sm rounded-[10px] border border-primary/10 shadow-lg p-5">
          <h3 className="text-lg font-semibold text-text mb-4">{t('aptStats')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={apptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2EBEA" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5A7A75' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A7A75' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2EBEA', borderRadius: 12, padding: '8px 12px' }}
                cursor={{ fill: 'rgba(112,151,210,0.08)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {apptData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white/80 backdrop-blur-sm rounded-[10px] border border-primary/10 shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text">{t('todaySchedule')}</h3>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary-deep border border-primary/20">
              {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short' })}
            </span>
          </div>

          {todayApts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarDays size={32} className="text-muted mb-2" />
              <p className="text-sm text-muted">{t('noTodayApts')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayApts.map((a) => (
                <div key={a._id} className={`flex items-center gap-3 p-2.5 rounded-[10px] transition-all ${a.isCompleted ? 'bg-emerald-50 border border-emerald-200' : 'bg-bg border border-border'}`}>
                  <div className="text-center min-w-11.25">
                    <p className="text-sm font-bold text-primary">{a.slotTime}</p>
                  </div>
                  <div className="w-px h-7 bg-border" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text">{a.userData?.name}</p>
                    <p className="text-xs text-muted">{a.amount}DA</p>
                  </div>
                  {a.isCompleted ? (
                    <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">✓ {t('done')}</span>
                  ) : (
                    <button
                      onClick={() => handleComplete(a._id)}
                      disabled={completing === a._id}
                      className="text-xs font-semibold px-2.5 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                    >
                      {completing === a._id ? '...' : t('completeBtn')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-[10px] border border-primary/10 shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text">{t('recentActivity')}</h3>
            <Link to="/doctor/appointments" className="text-sm text-primary hover:underline flex items-center gap-1">
              {t('viewAll')} <ArrowRight size={14} />
            </Link>
          </div>

          {recentApts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted">{t('noApts')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {[t('patient'), t('date'), t('time'), t('amount'), t('status'), t('actions')].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted uppercase tracking-wide px-3 pb-2.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentApts.map((a, i) => (
                    <tr key={a._id || i} className="border-b border-border hover:bg-bg/50 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary-deep">
                            {a.userData?.name?.charAt(0) || 'P'}
                          </div>
                          <span className="text-sm font-medium text-text">{a.userData?.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-sm text-sub">{a.slotDate?.replace(/_/g, '/')}</td>
                      <td className="px-3 py-2.5 text-sm text-sub">{a.slotTime}</td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-primary">${a.amount}</td>
                      <td className="px-3 py-2.5"><Badge status={getStatus(a)} /></td>
                      <td className="px-3 py-2.5">
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
    </div>
  )
}