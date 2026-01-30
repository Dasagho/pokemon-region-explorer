import { createBrowserRouter } from 'react-router-dom'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { HomePage } from '@/pages/home'
import { RegionPage } from '@/pages/region'
import { LocationPage } from '@/pages/location'
import { PokemonPage } from '@/pages/pokemon'

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
        handle: {
          crumb: () => 'Region',
        },
      },
      {
        path: '/location/:locationName',
        element: <LocationPage />,
        handle: {
          crumb: () => 'Location',
        },
      },
      {
        path: '/pokemon/:pokemonName',
        element: <PokemonPage />,
        handle: {
          crumb: () => 'Pokemon',
        },
      },
    ],
  },
])
