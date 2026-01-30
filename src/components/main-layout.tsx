import { Link, useLocation } from 'react-router-dom'
import { MapPin, Home, Sparkles } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '#', label: 'Regions', icon: MapPin },
]

export function MainLayout ({ children }: MainLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <Sparkles className="h-6 w-6" />
              <span className="font-bold inline-block">PokéRegion</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    'transition-colors hover:text-foreground/80',
                    location.pathname === item.path ? 'text-foreground' : 'text-foreground/60',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={cn(
                        'flex items-center space-x-2 text-sm font-medium transition-colors',
                        location.pathname === item.path
                          ? 'text-foreground'
                          : 'text-foreground/60 hover:text-foreground',
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Data provided by{' '}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              PokéAPI
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
