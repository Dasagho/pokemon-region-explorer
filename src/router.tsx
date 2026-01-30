import { createBrowserRouter, Outlet } from 'react-router-dom'
import { MainLayout } from '@/components/main-layout'
import { HomePage } from '@/pages/home'
import { RegionPage } from '@/pages/region'
import { LocationPage } from '@/pages/location'
import { PokemonPage } from '@/pages/pokemon'

const LayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
)

export const router = createBrowserRouter([
  {
    element: <LayoutWrapper />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/region/:regionName',
        element: <RegionPage />,
      },
      {
        path: '/location/:locationName',
        element: <LocationPage />,
      },
      {
        path: '/pokemon/:pokemonName',
        element: <PokemonPage />,
      },
    ],
  },
])
