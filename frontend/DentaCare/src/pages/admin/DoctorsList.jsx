import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Trash2, ToggleLeft, ToggleRight, Stethoscope, DollarSign, GraduationCap, Activity, ChevronDown, Users, Clock, Layers, CheckCircle } from 'lucide-react'
import { Badge, EmptyState, Modal, StatCard, MiniStat } from '../../components/ui/components'
import useAdminStore from '../../store/adminStore'
import useT from '../../hooks/useT'
import api from '../../lib/axios'
import { PageLoader } from '../../components/ui/Skeleton'

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
      const { data } = await api.get('/admin/doctors', { headers: { atoken: aToken } })
      if (data.success) setDoctors(data.doctors)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleToggle = async (docId) => {
    try {
      const { data } = await api.put(`/admin/doctors/${docId}`, {}, { headers: { atoken: aToken } })
      if (data.success) fetch()
    } catch(e) { console.error(e) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/doctors/${deleteId}`, { headers: { atoken: aToken } })
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

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-5 animate-fade-in mt-8">

      {/* FILTER SECTION WITH FULL-WIDTH HERO HEADER */}
      <div className="flex flex-col gap-6 bg-white p-5 rounded-2xl border border-border shadow-sm">
        
        {/* NEW FULL-WIDTH HERO HEADER INTEGRATED INSIDE THE SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <h2 className="text-[20px] font-bold text-primary-deep">
              {t('allDoctors')}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 bg-bg/50 border border-border/40 rounded-xl p-3.5 sm:min-w-[200px]">
            <div className="inline-flex items-center justify-center bg-accent-soft text-primary-hov font-bold h-9 px-3 rounded-lg text-base shadow-2xs">
              {doctors.length}
            </div>
            <p className="text-xs text-text font-medium leading-tight">
              {t('registered') || 'medical profiles registered'}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat
            title={t('totalDoctors')}
            value={doctors.length}
            color="success"
          />
          <MiniStat
            title={t('available')}
            value={doctors.filter(d => d.available).length}
            color="accentSoft"
          />
          <MiniStat
            title={t('onLeave')}
            value={doctors.filter(d => !d.available).length}
            color="accent"
          />
          <MiniStat
            title={t('specialities')}
            value={SPECIALITIES.length}
            color="primary"
          />
        </div>

        {/* The actual controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between pt-4 border-t border-dashed border-border">
          
          {/* Search */}
          <div className="relative flex-1 w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input pl-9 w-full  border-gray-200  transition-all"
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {/* Quick Status Filters */}
            <div className="flex bg-bg p-1 rounded-xl border border-border">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-sub hover:text-text'
                }`}
              >
                <Users size={14} /> {t('all')}
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                  filter === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-sub hover:text-text'
                }`}
              >
                <Activity size={14} /> {t('active')}
              </button>
            </div>

            {/* Speciality Dropdown */}
            <div className="relative min-w-50">
              <Stethoscope size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10" />
              <select
                className="input pl-9 pr-8 appearance-none cursor-pointer bg-bg/50 border-none"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">{t('filterSpeciality')}</option>
                {SPECIALITIES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0
        ? <EmptyState message={t('noDoctors')}
            action={{ label: `+ ${t('addDoctor')}`, onClick: () => navigate('/admin/add-doctor') }} />
        : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
            {filtered.map(d => (
              <div key={d._id} className="card p-4 flex flex-col gap-3">

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
                    {d.fees}DA
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