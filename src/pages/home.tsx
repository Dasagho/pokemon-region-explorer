import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { MapPin, ChevronRight, Sparkles } from 'lucide-react'
import { pokeApi, type Region, type Pokemon } from '@/services/pokeApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hero } from '@/components/hero'
import { RegionSkeleton } from '@/components/region-skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { getRegionColors, getRegionImageUrl } from '@/config/region-config'

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

export function HomePage () {
  const { t } = useTranslation()
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
        setError(t('common.error'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRegions()
  }, [t])

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

  // Get region description based on current language
  const getRegionDescription = (regionName: string) => {
    return t(`regions.regionInfo.${regionName}`, { defaultValue: t('regions.explore') })
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
          <h2 className="text-2xl font-bold text-destructive mb-2">{t('common.error')}</h2>
          <p className="text-muted-foreground">{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t('app.title')}</title>
        <meta name="description" content={t('app.description')} />
      </Helmet>
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
            <h2 className="text-3xl font-bold tracking-tight mb-1">{t('regions.title')}</h2>
            <p className="text-muted-foreground">
              {t('regions.subtitle', { count: regions.length })}
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
              const colors = getRegionColors(region.name)
              const imageUrl = getRegionImageUrl(region.name)

              return (
                <motion.div key={region.name} variants={cardVariants} custom={index}>
                  <Link to={`/region/${region.name}`}>
                    <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 card-lift">
                      {/* Background Gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${colors.gradientHover} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />

                      <CardHeader className="relative pb-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`${colors.bg} ${colors.text} capitalize font-medium`}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {t('regions.region')}
                          </Badge>
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                        <CardTitle className="text-2xl mt-3 group-hover:text-primary transition-colors duration-300">
                          {formatRegionName(region.name)}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {getRegionDescription(region.name)}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="relative">
                        <div className="flex justify-center py-6">
                          {imageUrl ? (
                            <motion.img
                              src={imageUrl}
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
