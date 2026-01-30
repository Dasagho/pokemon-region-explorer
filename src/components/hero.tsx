import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MapPin, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Pokemon } from '@/services/pokeApi'

interface HeroProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalRegions: number
  searchResults: Pokemon[]
  isSearching: boolean
}

export function Hero ({
  searchQuery,
  onSearchChange,
  totalRegions,
  searchResults,
  isSearching,
}: HeroProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearSearch = () => {
    onSearchChange('')
    inputRef.current?.focus()
  }

  return (
    <section className="relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-purple-500/20 to-blue-500/20 animate-gradient" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 blur-2xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-40 right-[15%] w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-500/30 blur-2xl"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-[20%] w-36 h-36 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-500/30 blur-2xl"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Explore {totalRegions} Regions</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              PokéRegion
            </span>
            <br />
            <span className="text-foreground">Explorer</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover Pokemon by their natural habitats. Browse regions, explore locations, and find
            encounter details for your favorite Pokemon.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search Pokemon by name..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-base shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isFocused && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.slice(0, 10).map((pokemon, index) => (
                        <Link
                          key={pokemon.name}
                          to={`/pokemon/${pokemon.name}`}
                          onClick={() => {
                            onSearchChange('')
                            setIsFocused(false)
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0"
                          >
                            <img
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                              alt={pokemon.name}
                              className="w-10 h-10 object-contain"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                              }}
                            />
                            <span className="capitalize font-medium">{pokemon.name}</span>
                          </motion.div>
                        </Link>
                      ))}
                      {searchResults.length > 10 && (
                        <div className="px-4 py-2 text-center text-sm text-muted-foreground border-t border-border">
                          +{searchResults.length - 10} more results
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No Pokemon found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 mt-10"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{totalRegions} Regions</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">1000+ Pokemon</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">Live Data</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  )
}
