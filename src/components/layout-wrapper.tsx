import { Outlet } from 'react-router-dom'
import { MainLayout } from '@/components/main-layout'

export function LayoutWrapper () {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
