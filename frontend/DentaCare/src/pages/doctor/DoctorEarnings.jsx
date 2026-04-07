
import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Clock, CheckCircle, Calendar, User, CreditCard } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCard, Badge, Loader, EmptyState } from '../../components/common/components'
import useDoctorStore from '../../store/doctorStore'
import api from '../../lib/axios'
import useDT from '../../hooks/useDT'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

export default function DoctorEarnings() {
  const { dToken, lang } = useDoctorStore()
  const t = useDT()

  const [apts, setApts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/doctor/appointments', { headers: { dtoken: dToken } })
      .then(({ data }) => { if (data.success) setApts(data.appointments) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const completed = apts.filter(a => a.isCompleted && !a.cancelled)
  const paid = apts.filter(a => a.isPaid && !a.cancelled)
  const unpaid = apts.filter(a => !a.isPaid && !a.cancelled && !a.isCompleted)
  const totalRev = completed.reduce((s, a) => s + (a.amount || 0), 0)
  const pendingRev = unpaid.reduce((s, a) => s + (a.amount || 0), 0)

  const mNames = lang === 'fr' ? monthsFr : months
  const monthly = Array(12).fill(0)
  completed.forEach(a => {
    if (a.slotDate) {
      const parts = a.slotDate.split('_')
      if (parts[1]) monthly[parseInt(parts[1]) - 1] += a.amount || 0
    }
  })
  const revenueData = mNames.slice(0, 6).map((m, i) => ({ month: m, revenue: monthly[i] }))

  const headers = [
    { key: '#', icon: null, label: '#' },
    { key: 'patient', icon: User, label: t('patient') },
    { key: 'date', icon: Calendar, label: t('date') },
    { key: 'amount', icon: DollarSign, label: t('amount') },
    { key: 'payment', icon: CreditCard, label: t('payment') },
  ]

  if (loading) return <Loader fullScreen />

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-text">{t('earnings')}</h2>
        <p className="text-sm text-sub">{lang === 'en' ? 'Your earnings overview' : 'Aperçu de vos revenus'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('totalRev')} value={`$${totalRev.toLocaleString()}`} icon={DollarSign} color="success" />
        <StatCard title={t('paidApts')} value={paid.length} icon={CheckCircle} color="accentSoft" />
        <StatCard title={t('pendingPayments')} value={`$${pendingRev.toLocaleString()}`} icon={Clock} color="primary" />
        <StatCard title={t('completedApts')} value={completed.length} icon={TrendingUp} color="accent" />
      </div>

      {/* Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text">{t('earningsChart')}</h3>
          <span className="badge badge-primary">2026</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7097D2" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7097D2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2EBEA" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#2C2C2A' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#2C2C2A' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2EBEA', borderRadius: 12, padding: '8px 12px' }}
              cursor={{ fill: 'rgba(112,151,210,0.08)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#2C2C2A" strokeWidth={2.5} fill="url(#earnGrad)" dot={{ fill: '#2C2C2A', strokeWidth: 0, r: 3.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Earnings History Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-primary/10 bg-primary/5">
          <h3 className="text-lg font-semibold text-text">{t('earningsHistory')}</h3>
        </div>
        {completed.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState message={t('noEarnings')} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg/40">
                  {headers.map(({ key, icon: Icon, label }) => (
                    <th key={key} className="text-left text-xs font-semibold text-primary-hov uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {Icon && <Icon size={12} />}
                        {label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {completed.map((a, i) => (
                  <tr key={a._id || i} className="border-b border-border hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted font-medium">{i + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary-hov shrink-0">
                          {a.userData?.name?.charAt(0) || 'P'}
                        </div>
                        <span className="text-sm font-medium text-text">{a.userData?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-sub whitespace-nowrap">
                      {a.slotDate?.replace(/_/g, '/')}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-primary whitespace-nowrap">
                      ${a.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge status={a.isPaid ? 'paid' : 'unpaid'} />
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