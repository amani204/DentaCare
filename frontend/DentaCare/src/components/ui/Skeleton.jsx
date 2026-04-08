
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Doctor card skeleton
export const DoctorCardSkeleton = () => (
  <div className="bg-white border border-border rounded-[10px] overflow-hidden">
    <div className="h-80 bg-gray-200 animate-pulse" />
    <div className="p-5">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
    </div>
  </div>
);
//skeleton for the detail view
export const DoctorDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);