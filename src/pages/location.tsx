import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Fish, Waves, Leaf } from 'lucide-react'
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

export function LocationPage () {
  const { locationName } = useParams<{ locationName: string }>()
  const [location, setLocation] = useState<LocationDetails | null>(null)
  const [areas, setAreas] = useState<LocationAreaDetails[]>([])
  const [encounters, setEncounters] = useState<Map<string, EncounterInfo>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocation = async () => {
      if (!locationName) return

      try {
        setLoading(true)
        const locationData = await pokeApi.getLocationDetails(locationName)
        setLocation(locationData)

        // Fetch area details for all areas
        const areaDetails = await Promise.all(
          locationData.areas.map(area => pokeApi.getLocationAreaDetails(area.name)),
        )
        setAreas(areaDetails)

        // Process encounters
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
    if (method.includes('surf')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    if (method.includes('fish')) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
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

  if (error || !location) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error || 'Location not found'}</p>
        </div>
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

  return (
    <div className="container py-10">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to={`/region/${location.region.name}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {formatName(location.region.name)}
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">{formatName(location.name)}</h1>
        </div>
        <p className="text-muted-foreground">
          {encounterList.length} Pokemon available in {areas.length} area
          {areas.length !== 1 ? 's' : ''}
        </p>
      </div>

      {Object.keys(groupedByMethod).length > 0 ? (
        <Tabs defaultValue={Object.keys(groupedByMethod)[0]} className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto">
            {Object.keys(groupedByMethod).map(method => (
              <TabsTrigger key={method} value={method} className="capitalize">
                {formatName(method)}
                <Badge variant="secondary" className="ml-2">
                  {groupedByMethod[method].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedByMethod).map(([method, methodEncounters]) => {
            const Icon = getMethodIcon(method)
            return (
              <TabsContent key={method} value={method}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {methodEncounters
                    .sort((a, b) => a.pokemon.id - b.pokemon.id)
                    .map(encounter => (
                      <Link key={encounter.pokemon.name} to={`/pokemon/${encounter.pokemon.name}`}>
                        <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className={getMethodColor(method)}>
                                <Icon className="h-3 w-3 mr-1" />
                                {formatName(method)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                #{encounter.pokemon.id.toString().padStart(3, '0')}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col items-center">
                              <img
                                src={
                                  encounter.pokemon.sprites.other['official-artwork']
                                    .front_default ||
                                  encounter.pokemon.sprites.front_default ||
                                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                                }
                                alt={encounter.pokemon.name}
                                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
                              />
                              <h3 className="font-semibold capitalize mt-2">
                                {encounter.pokemon.name}
                              </h3>
                              <div className="flex gap-1 mt-1">
                                {encounter.pokemon.types.map(t => (
                                  <Badge
                                    key={t.type.name}
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {t.type.name}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3 text-sm text-muted-foreground">
                                Lv. {encounter.minLevel}-{encounter.maxLevel}
                                <span className="mx-2">•</span>
                                {encounter.chance}%
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pokemon Encounters</h3>
              <p className="text-muted-foreground">
                This location doesn't have any recorded wild Pokemon encounters in the database.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
