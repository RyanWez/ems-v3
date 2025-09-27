import BirthdaySkeleton from '@/components/skeletons/BirthdaySkeleton';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {/* Header Skeleton */}
      <div className="animate-pulse mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner
          size="lg"
          text="Loading birthday data..."
          className="text-blue-600"
        />
      </div>

      {/* Keep skeleton as fallback */}
      <div className="hidden">
        <BirthdaySkeleton />
      </div>
    </div>
  );
}
