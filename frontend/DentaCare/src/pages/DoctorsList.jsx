
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, ToggleLeft, ToggleRight, Stethoscope, User, DollarSign, GraduationCap, Activity, ChevronDown, Users } from 'lucide-react'
import { Badge, Loader, EmptyState, Modal } from '../components/common/components'
import useAdminStore from '../store/adminStore'
import useT from '../hooks/useT'
import api from '../lib/axios'

const SPECIALITIES = ['General Dentist','Orthodontist','Endodontist','Periodontist','Oral Surgeon','Pediatric Dentist','Prosthodontist']

export default function DoctorsList() {
  const { aToken } = useAdminStore()
  const navigate   = useNavigate()
  const t          = useT()

  const [doctors,  setDoctors]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetch = async () => {
    try {
      const { data } = await api.get('/api/admin/doctors', { headers: { atoken: aToken } })
      if (data.success) setDoctors(data.doctors)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleToggle = async (docId) => {
    try {
      const { data } = await api.put(`/api/admin/doctors/${docId}`, {}, { headers: { atoken: aToken } })
      if (data.success) fetch()
    } catch(e) { console.error(e) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/api/admin/doctors/${deleteId}`, { headers: { atoken: aToken } })
      setDeleteId(null); fetch()
    } catch(e) { console.error(e) }
    finally { setDeleting(false) }
  }

  useEffect(() => { fetch() }, [])

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.speciality.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
                        (filter === 'active' && d.available) ||
                        (filter === 'inactive' && !d.available) ||
                        d.speciality === filter
    return matchSearch && matchFilter
  })

  if (loading) return <Loader fullScreen />

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="page-title">{t('allDoctors')}</h2>
          <p className="sub-text">{doctors.length} {t('registered')}</p>
        </div>
        <button onClick={() => navigate('/add-doctor')} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          {t('addDoctor')}
        </button>
      </div>

      {/*  Filter Section */}
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
   {/* Search */}
  <div className="relative flex-1 max-w-sm">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
    <input
      className="input pl-9"
      placeholder={t('searchDoctors')}
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  </div>

  {/* Quick Status Filters */}
  <div className="flex gap-2">
    <button
      onClick={() => setFilter('all')}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
        filter === 'all'
          ? 'bg-primary text-white shadow-sm'
          : 'bg-bg text-sub hover:bg-border'
      }`}
    >
      <Users size={14} /> All ({doctors.length})
    </button>
    <button
      onClick={() => setFilter('active')}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
        filter === 'active'
          ? 'bg-emerald-500 text-white shadow-sm'
          : 'bg-bg text-sub hover:bg-border'
      }`}
    >
      <Activity size={14} /> Active
    </button>
    <button
      onClick={() => setFilter('inactive')}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
        filter === 'inactive'
          ? 'bg-amber-500 text-white shadow-sm'
          : 'bg-bg text-sub hover:bg-border'
      }`}
    >
      <ToggleLeft size={14} /> Inactive
    </button>
  </div>

  {/* Speciality Dropdown */}
  <div className="relative min-w-45">
    <Stethoscope size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10" />
    <select
      className="input pl-9 pr-8 appearance-none cursor-pointer"
      value={filter}
      onChange={e => setFilter(e.target.value)}
    >
      <option value="all">All Specialities</option>
      {SPECIALITIES.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
  </div>
</div>

      {/* Cards grid */}
      {filtered.length === 0
        ? <EmptyState message={t('noDoctors')}
            action={{ label: `+ ${t('addDoctor')}`, onClick: () => navigate('/add-doctor') }} />
        : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
            {filtered.map(d => (
              <div key={d._id} className="card-hover p-4 flex flex-col gap-3">

                {/* Image */}
                <div className="relative">
                  <img src={d.image || '/placeholder.png'} alt={d.name}
                    className="w-full h-32 object-cover rounded-lg bg-bg" />
                  <div className="absolute top-2 right-2">
                    <Badge status={d.available ? 'active' : 'inactive'} />
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p className="font-semibold text-sm text-text">{d.name}</p>
                  <p className="sub-text text-xs mt-0.5">{d.speciality}</p>
                </div>

                {/* Meta */}
                <div className="flex justify-between items-center">
                  <span className="sub-text text-xs flex items-center gap-1">
                    <GraduationCap size={12} /> {d.degree} · {d.experience} {t('experience')}
                  </span>
                  <span className="font-bold text-sm text-primary-hov flex items-center gap-0.5">
                    <DollarSign size={12} />{d.fees}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2.5 border-t border-border items-center">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(d._id)}
                    className="text-sub hover:text-primary transition-colors"
                    title={d.available ? t('disable') : t('enable')}
                  >
                    {d.available ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <span className="sub-text text-xs">
                    {d.available ? t('statusActive') : t('statusInactive')}
                  </span>
                  <div className="ml-auto">
                    <button
                      className="btn-icon w-8 h-8 text-sub hover:text-red-500 hover:bg-red-50"
                      title={t('delete')}
                      onClick={() => setDeleteId(d._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('delete')}
        message="Are you sure you want to remove this doctor?"
        confirmText={t('delete')}
        cancelText={t('cancel')}
        type="danger"
        loading={deleting}
      />
    </div>
  )
}