// src/components/common/components.jsx
import { useEffect } from 'react'
import { XCircle, CheckCircle, AlertCircle, Info, Trash2, Loader2, Inbox, AlertTriangle } from 'lucide-react'
import useT from '../../hooks/useT'

/* ── BADGE ── */
const badgeMap = {
  completed: { cls: 'badge-success', key: 'statusCompleted', icon: CheckCircle },
  cancelled: { cls: 'badge-danger',  key: 'statusCancelled', icon: XCircle },
  pending:   { cls: 'badge-warning', key: 'statusPending',   icon: AlertCircle },
  paid:      { cls: 'badge-primary', key: 'statusPaid',      icon: CheckCircle },
  unpaid:    { cls: 'badge-warning', key: 'statusUnpaid',    icon: AlertCircle },
  active:    { cls: 'badge-success', key: 'statusActive',    icon: CheckCircle },
  inactive:  { cls: 'badge-muted',   key: 'statusInactive',  icon: XCircle },
}

export function Badge({ status }) {
  const t = useT()
  const key = status?.toLowerCase() || 'pending'
  const m = badgeMap[key] || badgeMap.pending
  const Icon = m.icon

  return (
    <span className={`badge ${m.cls} inline-flex items-center gap-1`}>
      <Icon size={10} className="shrink-0" />
      {t(m.key)}
    </span>
  )
}

/* ── STAT CARD ── */
const statVariants = {
  primary: {
    bg: 'bg-primary/5',
    border: 'border-l-primary',
    text: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  success: {
    bg: 'bg-emerald-500/5',
    border: 'border-l-emerald-500',
    text: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10',
  },
  accent: {
    bg: 'bg-accent/5',
    border: 'border-l-accent',
    text: 'text-accent',
    iconBg: 'bg-accent/10',
  },
  info: {
    bg: 'bg-blue-500/5',
    border: 'border-l-blue-500',
    text: 'text-blue-600',
    iconBg: 'bg-blue-500/10',
  },
}

export function StatCard({ title, value, icon: Icon, trend, color = 'primary' }) {
  const v = statVariants[color] || statVariants.primary

  return (
    <div className={`
      card p-5 relative overflow-hidden transition-all duration-200 
      hover:shadow-lg hover:-translate-y-0.5 border-l-2 ${v.border} ${v.bg}
    `}>
      <div className="relative">
        <div className="flex justify-between items-start mb-3.5">
          <p className="label-text text-xs uppercase tracking-wide text-muted">
            {title}
          </p>
          <div className={`w-9 h-9 rounded-lg ${v.iconBg} flex items-center justify-center ${v.text}`}>
            {Icon && <Icon size={18} />}
          </div>
        </div>
        <p className={`text-2xl font-bold ${v.text} leading-tight`}>{value}</p>
        {trend && <p className="sub-text text-xs mt-1">{trend}</p>}
      </div>
    </div>
  )
}

/* ── LOADER ── */
export function Loader({ fullScreen = false }) {
  const spinner = (
    <Loader2 size={32} className="animate-spin text-primary" />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg/85 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="sub-text text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center py-12">
      {spinner}
    </div>
  )
}

/* ── EMPTY STATE ── */
export function EmptyState({ message, icon: Icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon ? (
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3.5">
          <Icon size={22} strokeWidth={1.5} />
        </div>
      ) : (
        <Inbox size={40} className="text-muted/50 mb-3.5" />
      )}
      <p className="sub-text max-w-[240px] leading-relaxed">{message}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary mt-5 text-sm">
          {action.label}
        </button>
      )}
    </div>
  )
}

/* ── MODAL ── */
export function Modal({ 
  isOpen, onClose, onConfirm, title, message, 
  confirmText = 'Confirm', cancelText = 'Cancel', 
  type = 'danger', loading = false 
}) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isDanger = type === 'danger'
  const IconComponent = isDanger ? AlertTriangle : Info

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#091E5D]/15 backdrop-blur-sm" 
      />
      
      {/* Modal */}
      <div className="glass relative w-full max-w-md p-6 animate-slide-up">
        <div className="flex gap-4 mb-5">
          <div className={`
            w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center
            ${isDanger ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}
          `}>
            <IconComponent size={20} />
          </div>
          <div>
            <h3 className="section-title">{title}</h3>
            <p className="sub-text mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={onClose} 
            disabled={loading} 
            className="btn btn-ghost text-sm"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading} 
            className={`btn text-sm ${isDanger ? 'btn-danger' : 'btn-primary'} flex items-center gap-1`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}