import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Fish, Waves, Leaf, Sparkles, ChevronRight } from 'lucide-react'
import {
  pokeApi,
  type LocationDetails,
  type LocationAreaDetails,
  type Pokemon,
} from '@/services/pokeApi'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EncounterInfo {
  pokemon: Pokemon
  minLevel: number
  maxLevel: number
  chance: number
  method: string
  versions: string[]
}

interface LocationInfo {
  name: string
  regionName: string
  areas: LocationAreaDetails[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

export function LocationPage () {
  const { locationName } = useParams<{ locationName: string }>()
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [areas, setAreas] = useState<LocationAreaDetails[]>([])
  const [encounters, setEncounters] = useState<Map<string, EncounterInfo>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocation = async () => {
      if (!locationName) return

      try {
        setLoading(true)

        // Use the smart method that handles both location and location-area
        const data = await pokeApi.getLocationOrAreaDetails(locationName)

        let locationData: LocationInfo
        let areaDetails: LocationAreaDetails[] = []

        // Check if it's a location-area (has pokemon_encounters) or location (has areas)
        if ('pokemon_encounters' in data) {
          // It's a location-area directly
          const areaData = data as LocationAreaDetails
          locationData = {
            name: areaData.name,
            regionName: areaData.location.name,
            areas: [],
          }
          areaDetails = [areaData]
        } else {
          // It's a location with sub-areas
          const locData = data as LocationDetails
          locationData = {
            name: locData.name,
            regionName: locData.region.name,
            areas: [],
          }

          // Fetch area details for all areas
          areaDetails = await Promise.all(
            locData.areas.map(area => pokeApi.getLocationAreaDetails(area.name)),
          )
        }

        setLocationInfo(locationData)
        setAreas(areaDetails)

        // Process encounters from all areas
        const encounterMap = new Map<string, EncounterInfo>()
        for (const area of areaDetails) {
          for (const encounter of area.pokemon_encounters) {
            const pokemonName = encounter.pokemon.name

            for (const versionDetail of encounter.version_details) {
              for (const detail of versionDetail.encounter_details) {
                if (encounterMap.has(pokemonName)) {
                  const existing = encounterMap.get(pokemonName)!
                  existing.versions.push(versionDetail.version.name)
                  existing.minLevel = Math.min(existing.minLevel, detail.min_level)
                  existing.maxLevel = Math.max(existing.maxLevel, detail.max_level)
                  existing.chance = Math.max(existing.chance, detail.chance)
                } else {
                  encounterMap.set(pokemonName, {
                    pokemon: { name: pokemonName } as Pokemon,
                    minLevel: detail.min_level,
                    maxLevel: detail.max_level,
                    chance: detail.chance,
                    method: detail.method.name,
                    versions: [versionDetail.version.name],
                  })
                }
              }
            }
          }
        }

        // Fetch Pokemon details
        const pokemonDetails = await Promise.all(
          Array.from(encounterMap.keys()).map(name => pokeApi.getPokemon(name)),
        )

        for (const pokemon of pokemonDetails) {
          const info = encounterMap.get(pokemon.name)
          if (info) {
            info.pokemon = pokemon
          }
        }

        setEncounters(encounterMap)
      } catch (err) {
        setError('Failed to load location details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [locationName])

  const formatName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getMethodIcon = (method: string) => {
    if (method.includes('surf')) return Waves
    if (method.includes('fish')) return Fish
    return Leaf
  }

  const getMethodColor = (method: string) => {
    if (method.includes('surf')) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    }
    if (method.includes('fish')) {
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    }
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  }

  const getMethodGradient = (method: string) => {
    if (method.includes('surf')) return 'from-blue-500/20 to-cyan-500/20'
    if (method.includes('fish')) return 'from-cyan-500/20 to-teal-500/20'
    return 'from-emerald-500/20 to-green-500/20'
  }

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-[300px] mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[180px]" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !locationInfo) {
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
          <p className="text-muted-foreground">{error || 'Location not found'}</p>
        </motion.div>
      </div>
    )
  }

  const encounterList = Array.from(encounters.values())
  const groupedByMethod = encounterList.reduce(
    (acc, encounter) => {
      const method = encounter.method
      if (!acc[method]) acc[method] = []
      acc[method].push(encounter)
      return acc
    },
    {} as Record<string, EncounterInfo[]>,
  )

  const methodKeys = Object.keys(groupedByMethod)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative container py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="ghost" className="mb-6 -ml-2" asChild>
              <Link to={`/region/${locationInfo.regionName}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {formatName(locationInfo.regionName)}
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {formatName(locationInfo.name)}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {encounterList.length} Pokemon in {areas.length} area
                  {areas.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container pb-16">
        {methodKeys.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue={methodKeys[0]} className="w-full">
              <TabsList className="mb-8 flex-wrap h-auto gap-2">
                {methodKeys.map(method => {
                  const Icon = getMethodIcon(method)
                  return (
                    <TabsTrigger
                      key={method}
                      value={method}
                      className="capitalize gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {formatName(method)}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {groupedByMethod[method].length}
                      </Badge>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {Object.entries(groupedByMethod).map(([method, methodEncounters]) => {
                const Icon = getMethodIcon(method)
                const gradient = getMethodGradient(method)
                return (
                  <TabsContent key={method} value={method}>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                      {methodEncounters
                        .sort((a, b) => a.pokemon.id - b.pokemon.id)
                        .map((encounter) => (
                          <motion.div key={encounter.pokemon.name} variants={cardVariants}>
                            <Link to={`/pokemon/${encounter.pokemon.name}`}>
                              <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 card-lift">
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <CardHeader className="relative pb-2">
                                  <div className="flex items-center justify-between">
                                    <Badge
                                      variant="secondary"
                                      className={`${getMethodColor(method)} border`}
                                    >
                                      <Icon className="h-3 w-3 mr-1" />
                                      {formatName(method)}
                                    </Badge>
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-2 block">
                                    #{encounter.pokemon.id.toString().padStart(3, '0')}
                                  </span>
                                </CardHeader>

                                <CardContent className="relative">
                                  <div className="flex flex-col items-center">
                                    <motion.img
                                      src={
                                        encounter.pokemon.sprites.other['official-artwork']
                                          .front_default ||
                                        encounter.pokemon.sprites.front_default ||
                                        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                                      }
                                      alt={encounter.pokemon.name}
                                      className="w-28 h-28 object-contain drop-shadow-lg"
                                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                      transition={{ duration: 0.5 }}
                                    />
                                    <h3 className="font-semibold capitalize mt-3 group-hover:text-primary transition-colors">
                                      {encounter.pokemon.name}
                                    </h3>
                                    <div className="flex gap-1 mt-2">
                                      {encounter.pokemon.types.slice(0, 2).map(t => (
                                        <Badge
                                          key={t.type.name}
                                          variant="outline"
                                          className="text-xs capitalize"
                                        >
                                          {t.type.name}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="mt-4 px-3 py-1.5 rounded-full bg-muted text-sm">
                                      Lv. {encounter.minLevel}-{encounter.maxLevel}
                                      <span className="mx-2 text-muted-foreground">•</span>
                                      {encounter.chance}%
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        ))}
                    </motion.div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Pokemon Encounters</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This location doesn't have any recorded wild Pokemon encounters in the database.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </section>
    </div>
  )
}
