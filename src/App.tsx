import { ThemeProvider } from '@/components/theme-provider'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from '@/router'
import { ErrorBoundary } from '@/components/error-boundary'

function App () {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="system" storageKey="pokemon-explorer-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
