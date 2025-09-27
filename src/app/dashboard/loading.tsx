import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>

      {/* Content with Spinner */}
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner
          size="lg"
          text="Loading dashboard data..."
          className="text-blue-600"
        />
      </div>

      {/* Keep skeleton as fallback */}
      <DashboardSkeleton />
    </div>
  );
}