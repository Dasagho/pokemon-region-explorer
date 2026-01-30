import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

export function RegionSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-full mb-6" />
          <div className="flex justify-center">
            <Skeleton className="h-28 w-28 rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
