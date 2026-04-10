
// ── Base shimmer ──────────────────────────────────────────────────────────────
const shimmer = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

if (typeof document !== 'undefined' && !document.getElementById('skeleton-style')) {
  const style = document.createElement('style')
  style.id = 'skeleton-style'
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
  document.head.appendChild(style)
}

export const Skeleton = ({ className = '' }) => (
  <div className={`rounded ${className}`} style={shimmer} />
)

// ── Doctor Card Skeleton ──────────────────────────────────────────────────────
export const DoctorCardSkeleton = () => (
  <div className="bg-white border border-border rounded-[10px] overflow-hidden">

    {/* Image area */}
    <div className="h-80 relative" style={shimmer}>
      {/* Availability badge placeholder */}
      <div
        className="absolute top-3 right-3 w-20 h-6 rounded-full"
        style={{ background: 'rgba(255,255,255,0.5)' }}
      />
      {/* Price badge placeholder */}
      <div
        className="absolute bottom-3 left-3 w-16 h-7 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.4)' }}
      />
    </div>

    {/* Content */}
    <div className="p-4 space-y-2.5">
      {/* Name */}
      <div className="h-5 rounded-md w-3/4" style={shimmer} />
      {/* Speciality */}
      <div className="h-4 rounded-md w-1/2" style={shimmer} />
    </div>
  </div>
)

// ── Doctor Detail Skeleton ────────────────────────────────────────────────────
export const DoctorDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

      {/* Left — text content */}
      <div className="space-y-4">
        {/* Name */}
        <div className="h-9 rounded-lg w-2/3" style={shimmer} />
        {/* Speciality badge */}
        <div className="h-6 rounded-full w-32" style={shimmer} />
        {/* Tags row */}
        <div className="flex gap-2">
          <div className="h-7 rounded-full w-20" style={shimmer} />
          <div className="h-7 rounded-full w-24" style={shimmer} />
          <div className="h-7 rounded-full w-16" style={shimmer} />
        </div>
        {/* Bio lines */}
        <div className="space-y-2 pt-2">
          <div className="h-4 rounded w-full" style={shimmer} />
          <div className="h-4 rounded w-full" style={shimmer} />
          <div className="h-4 rounded w-4/5" style={shimmer} />
        </div>
        {/* Stats row */}
        <div className="flex gap-6 pt-4">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-1.5">
              <div className="h-7 w-14 rounded" style={shimmer} />
              <div className="h-3 w-16 rounded" style={shimmer} />
            </div>
          ))}
        </div>
        {/* Button */}
        <div className="h-12 rounded-xl w-48 mt-4" style={shimmer} />
      </div>

      {/* Right — image */}
      <div className="h-96 rounded-2xl" style={shimmer} />
    </div>
  </div>
)

// ── Page Loader ───────────────────────────────────────────────────────────────
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      {/* Spinner with centered D */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
       
      </div>

      {/* Dot pulse */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            style={{
              animation: `dotPulse 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  </div>
);