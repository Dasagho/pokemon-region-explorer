import { Link, useLocation, useMatches } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapPin, Home, Sparkles, ChevronRight } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout ({ children }: MainLayoutProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const matches = useMatches()

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/#regions', label: t('nav.regions'), icon: MapPin },
  ]

  // Generate breadcrumbs from route matches
  const breadcrumbs = matches
    .filter(match => match.handle && (match.handle as { crumb?: () => string }).crumb)
    .map(match => ({
      path: match.pathname,
      label: (match.handle as { crumb: () => string }).crumb(),
    }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <Link to="/" className="mr-6 flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="h-6 w-6 relative z-10 text-primary" />
              </motion.div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
                PokéRegion
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <LanguageSwitcher />
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="relative">
                  <MapPin className="h-5 w-5" />
                  <span className="sr-only">{t('nav.regions')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[340px]">
                <nav className="flex flex-col space-y-2 mt-8">
                  {navItems.map(item => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                        location.pathname === item.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="border-t bg-muted/30">
            <div className="container py-2">
              <nav className="flex items-center space-x-2 text-sm">
                <Link
                  to="/"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="h-4 w-4" />
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-foreground">{crumb.label}</span>
                    ) : (
                      <Link
                        to={crumb.path}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t('app.name')}</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {t('footer.dataProvidedBy')}{' '}
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
              >
                PokéAPI
              </a>
            </p>
            <p className="text-sm text-muted-foreground">{t('footer.builtWith')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
