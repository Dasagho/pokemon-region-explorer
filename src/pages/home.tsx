import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ChevronRight, Sparkles } from 'lucide-react'
import { pokeApi, type Region, type Pokemon } from '@/services/pokeApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hero } from '@/components/hero'
import { RegionSkeleton } from '@/components/region-skeleton'

const regionImages: Record<string, string> = {
  kanto:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  johto:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png',
  hoenn:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/260.png',
  sinnoh:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/392.png',
  unova:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/500.png',
  kalos:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png',
  alola:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png',
  galar:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/815.png',
  paldea:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png',
}

const regionColors: Record<string, { bg: string; text: string; gradient: string }> = {
  kanto: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  johto: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  hoenn: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  sinnoh: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    gradient: 'from-cyan-500/20 to-teal-500/20',
  },
  unova: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  kalos: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  alola: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  galar: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500/20 to-purple-500/20',
  },
  paldea: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
}

// Debounce hook
function useDebounce<T> (value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function HomePage () {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Pokemon[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fetch regions only (not all Pokemon)
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true)
        const regionsData = await pokeApi.getRegions()
        setRegions(regionsData)
      } catch (err) {
        setError('Failed to load regions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRegions()
  }, [])

  // Search Pokemon when debounced query changes
  useEffect(() => {
    const searchPokemon = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await pokeApi.searchPokemonByName(debouncedSearchQuery)
        setSearchResults(results)
      } catch (err) {
        console.error('Search error:', err)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    searchPokemon()
  }, [debouncedSearchQuery])

  const formatRegionName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-destructive mb-2">Oops!</h2>
          <p className="text-muted-foreground">{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalRegions={regions.length}
        searchResults={searchResults}
        isSearching={isSearching}
      />

      <section className="container py-12 md:py-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">Regions</h2>
            <p className="text-muted-foreground">
              {regions.length} {regions.length === 1 ? 'region' : 'regions'} available
            </p>
          </div>
        </motion.div>

        {/* Regions Grid */}
        {loading ? (
          <RegionSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {regions.map((region, index) => {
              const colors = regionColors[region.name] || {
                bg: 'bg-muted',
                text: 'text-muted-foreground',
                gradient: 'from-gray-500/20 to-gray-600/20',
              }

              return (
                <motion.div key={region.name} variants={cardVariants} custom={index}>
                  <Link to={`/region/${region.name}`}>
                    <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 card-lift">
                      {/* Background Gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />

                      <CardHeader className="relative pb-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`${colors.bg} ${colors.text} capitalize font-medium`}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Region
                          </Badge>
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                        <CardTitle className="text-2xl mt-3 group-hover:text-primary transition-colors duration-300">
                          {formatRegionName(region.name)}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          Explore locations, routes, and encounter wild Pokemon
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="relative">
                        <div className="flex justify-center py-6">
                          {regionImages[region.name] ? (
                            <motion.img
                              src={regionImages[region.name]}
                              alt={`${region.name} starter`}
                              className="w-28 h-28 object-contain drop-shadow-lg"
                              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                              transition={{ duration: 0.5 }}
                            />
                          ) : (
                            <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center">
                              <MapPin className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </section>
    </div>
  )
}
