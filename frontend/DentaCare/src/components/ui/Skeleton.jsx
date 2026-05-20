import React from 'react'

// ── Global Shimmer Animation ──────────────────────────────────────────────────
// We inject the styling once so your components stay purely class-based and clean.
if (typeof document !== 'undefined' && !document.getElementById('skeleton-global-style')) {
  const style = document.createElement('style')
  style.id = 'skeleton-global-style'
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .animate-shimmer {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite linear;
    }
    @keyframes dotPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }
    .animate-dot-pulse {
      animation: dotPulse 1.2s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}

// ── Shared Base Component ─────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-shimmer rounded-md ${className}`} />
)

// ── Doctor Card Skeleton ──────────────────────────────────────────────────────
export const DoctorCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
    {/* Image Area */}
    <div className="h-72 animate-shimmer relative">
      {/* Absolute Badges Placed On Top */}
      <div className="absolute top-3 right-3 w-20 h-6 rounded-full bg-white/40 backdrop-blur-sm" />
      <div className="absolute bottom-3 left-3 w-16 h-7 rounded-lg bg-white/40 backdrop-blur-sm" />
    </div>

    {/* Content */}
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)

// ── Doctor Detail Skeleton ────────────────────────────────────────────────────
export const DoctorDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
    {/* Left — Text Content */}
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-9 w-2/3 rounded-lg" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      
      {/* Tags row */}
      <div className="flex gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
      
      {/* Bio lines */}
      <div className="space-y-2.5 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      {/* Stats row */}
      <div className="flex gap-8 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      
      <Skeleton className="h-12 w-48 rounded-xl mt-4" />
    </div>

    {/* Right — Main Profile Image */}
    <Skeleton className="h-112.5 rounded-2xl" />
  </div>
)

// ── Page Loader ───────────────────────────────────────────────────────────────
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white">
    
    {/* Logo mark */}
    <p className="text-[15px] font-semibold tracking-tight text-slate-800 mb-4">
      Denta<span className="text-accent-soft">Care</span>
    </p>

    {/* Thin progress bar */}
    <div className="w-32 h-[2px] rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full w-1/2 bg-accent-soft rounded-full animate-[slide_1.2s_ease-in-out_infinite]" />
    </div>

    <p className="text-[12px] text-slate-400">Loading</p>

    <style>{`
      @keyframes slide {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(300%); }
      }
    `}</style>
  </div>
);