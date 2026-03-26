import { useEffect, useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  ArrowLeft,
  Ruler,
  Weight,
  Zap,
  Shield,
  Heart,
  Swords,
  Gauge,
  MapPin,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import {
  pokeApi,
  type Pokemon,
  type PokemonLocation,
  type LocalizedAbility,
} from '@/services/pokeApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-400',
  fairy: 'bg-pink-300',
}

const statIcons: Record<string, React.ReactNode> = {
  hp: <Heart className="h-4 w-4" />,
  attack: <Swords className="h-4 w-4" />,
  defense: <Shield className="h-4 w-4" />,
  'special-attack': <Zap className="h-4 w-4" />,
  'special-defense': <Shield className="h-4 w-4" />,
  speed: <Gauge className="h-4 w-4" />,
}

const METHOD_COLORS = {
  surf: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  fish: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  default: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
} as const

export function PokemonPage () {
  const { t, i18n } = useTranslation()
  const { pokemonName } = useParams<{ pokemonName: string }>()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [locations, setLocations] = useState<PokemonLocation[]>([])
  const [abilityNames, setAbilityNames] = useState<Map<string, LocalizedAbility>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!pokemonName) return

      try {
        setLoading(true)
        const [pokemonData, locationsData] = await Promise.all([
          pokeApi.getPokemon(pokemonName),
          pokeApi.getPokemonLocations(pokemonName),
        ])
        setPokemon(pokemonData)
        setLocations(locationsData)

        if (pokemonData.abilities?.length > 0) {
          const names = pokemonData.abilities.map(a => a.ability.name)
          const localized = await pokeApi.getAbilitiesLocalized(names)
          setAbilityNames(localized)
        }
      } catch {
        setError(t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [pokemonName, t])

  const getTotalStats = useCallback(() => {
    if (!pokemon) return 0
    return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  }, [pokemon])

  const processedLocations = useMemo(() => {
    const locationMap = new Map<
      string,
      {
        name: string
        methods: Set<string>
        versions: Set<string>
        minLevel: number
        maxLevel: number
      }
    >()

    locations.forEach(encounter => {
      const locationName = encounter.location_area.name
      const existing = locationMap.get(locationName)

      const allMethods = new Set<string>()
      const allVersions = new Set<string>()
      let minLvl = 100
      let maxLvl = 1

      encounter.version_details.forEach(vd => {
        allVersions.add(vd.version.name)
        vd.encounter_details.forEach(ed => {
          allMethods.add(ed.method.name)
          minLvl = Math.min(minLvl, ed.min_level)
          maxLvl = Math.max(maxLvl, ed.max_level)
        })
      })

      if (existing) {
        allMethods.forEach(m => existing.methods.add(m))
        allVersions.forEach(v => existing.versions.add(v))
        existing.minLevel = Math.min(existing.minLevel, minLvl)
        existing.maxLevel = Math.max(existing.maxLevel, maxLvl)
      } else {
        locationMap.set(locationName, {
          name: locationName,
          methods: allMethods,
          versions: allVersions,
          minLevel: minLvl,
          maxLevel: maxLvl,
        })
      }
    })

    return Array.from(locationMap.values())
  }, [locations])

  const getMethodColor = useCallback((method: string) => {
    const methodLower = method.toLowerCase()
    if (methodLower.includes('surf')) return METHOD_COLORS.surf
    if (methodLower.includes('fish')) return METHOD_COLORS.fish
    return METHOD_COLORS.default
  }, [])

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-destructive mb-2">{t('common.errorMessage')}</h2>
          <p className="text-muted-foreground">{error || t('common.notFound')}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>
          {pokeApi.getLocalizedName(pokemon.names, i18n.language, pokemon.name)} - {t('app.name')}
        </title>
        <meta name="description" content={t('pokemon.whereToFind')} />
      </Helmet>
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" className="mb-6 -ml-2" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('pokemon.backToRegions')}
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-muted to-muted/50 p-8">
                    <div className="absolute top-4 right-4">
                      <span className="text-6xl font-bold text-muted-foreground/20">
                        #{pokemon.id.toString().padStart(3, '0')}
                      </span>
                    </div>
                    <motion.img
                      src={
                        pokemon.sprites.other['official-artwork'].front_default ||
                        pokemon.sprites.front_default ||
                        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                      }
                      alt={pokemon.name}
                      className="w-64 h-64 mx-auto object-contain drop-shadow-2xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    />
                  </div>
                  <div className="p-6">
                    <h1 className="text-4xl font-bold capitalize mb-4">
                      {pokeApi.getLocalizedName(pokemon.names, i18n.language, pokemon.name)}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {pokemon.types.map(type => (
                        <Badge
                          key={type.type.name}
                          className={`${typeColors[type.type.name] || 'bg-gray-500'} text-white capitalize text-sm px-3 py-1`}
                        >
                          {type.type.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                        <Ruler className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('pokemon.height')}</p>
                          <p className="font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                        <Weight className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('pokemon.weight')}</p>
                          <p className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="stats">{t('pokemon.stats')}</TabsTrigger>
                  <TabsTrigger value="abilities">{t('pokemon.abilities')}</TabsTrigger>
                  <TabsTrigger value="locations">
                    {t('pokemon.locations')} ({processedLocations.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stats">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{t('pokemon.stats')}</span>
                        <Badge variant="secondary" className="text-lg">
                          {t('pokemon.totalStats', { count: getTotalStats() })}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pokemon.stats.map((stat, index) => {
                        const percentage = (stat.base_stat / 255) * 100
                        return (
                          <motion.div
                            key={stat.stat.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {statIcons[stat.stat.name]}
                                <span className="text-sm font-medium">
                                  {t(`pokemon.statNames.${stat.stat.name}`)}
                                </span>
                              </div>
                              <span className="text-sm font-bold">{stat.base_stat}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </motion.div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="abilities">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>{t('pokemon.abilities')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {pokemon.abilities?.map((ability, index) => {
                          const localizedAbility = abilityNames.get(ability.ability.name)
                          return (
                            <motion.div
                              key={ability.ability.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                              className="p-3 rounded-lg bg-muted"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="capitalize font-medium">
                                  {localizedAbility?.name.split('-').join(' ') ||
                                    ability.ability.name.split('-').join(' ')}
                                </span>
                                {ability.is_hidden && (
                                  <Badge variant="outline" className="text-xs">
                                    {t('pokemon.hidden')}
                                  </Badge>
                                )}
                              </div>
                              {localizedAbility?.effect && (
                                <p className="text-sm text-muted-foreground">
                                  {localizedAbility.effect}
                                </p>
                              )}
                            </motion.div>
                          )
                        }) || <p className="text-muted-foreground">{t('pokemon.noAbilities')}</p>}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="locations">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>{t('pokemon.whereToFind')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {processedLocations.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {processedLocations.map((location, index) => (
                            <motion.div
                              key={location.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <Link
                                to={`/location/${location.name}`}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium capitalize truncate">
                                    {location.name.split('-').join(' ')}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {t('pokemon.level', {
                                        min: location.minLevel,
                                        max: location.maxLevel,
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {Array.from(location.methods)
                                    .slice(0, 2)
                                    .map(method => (
                                      <Badge
                                        key={method}
                                        variant="secondary"
                                        className={`text-xs ${getMethodColor(method)}`}
                                      >
                                        {method.split('-').join(' ')}
                                      </Badge>
                                    ))}
                                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">{t('pokemon.noLocationData')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
