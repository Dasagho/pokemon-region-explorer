import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { Skeleton } from '@/components/ui/skeleton'

const HomePage = lazy(() => import('@/pages/home').then(m => ({ default: m.HomePage })))
const RegionPage = lazy(() => import('@/pages/region').then(m => ({ default: m.RegionPage })))
const LocationPage = lazy(() => import('@/pages/location').then(m => ({ default: m.LocationPage })))
const PokemonPage = lazy(() => import('@/pages/pokemon').then(m => ({ default: m.PokemonPage })))

function PageSkeleton () {
  return (
    <div className="container py-10">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <LayoutWrapper />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/region/:regionName',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <RegionPage />
          </Suspense>
        ),
        handle: {
          crumb: () => 'Region',
        },
      },
      {
        path: '/location/:locationName',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <LocationPage />
          </Suspense>
        ),
        handle: {
          crumb: () => 'Location',
        },
      },
      {
        path: '/pokemon/:pokemonName',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <PokemonPage />
          </Suspense>
        ),
        handle: {
          crumb: () => 'Pokemon',
        },
      },
    ],
  },
])
