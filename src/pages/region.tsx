import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, ChevronRight } from 'lucide-react'
import { pokeApi, type RegionDetails } from '@/services/pokeApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const regionInfo: Record<string, { description: string; generation: string; starters: string[] }> =
  {
    kanto: {
      description:
        'The first region introduced in the Pokemon series, featuring iconic locations like Pallet Town and Mt. Moon.',
      generation: 'Generation I',
      starters: ['bulbasaur', 'charmander', 'squirtle'],
    },
    johto: {
      description:
        'A region west of Kanto featuring the legendary Pokemon Ho-Oh and Lugia, with rich history and culture.',
      generation: 'Generation II',
      starters: ['chikorita', 'cyndaquil', 'totodile'],
    },
    hoenn: {
      description:
        'A region with diverse environments including volcanic areas, oceans, and vast routes.',
      generation: 'Generation III',
      starters: ['treecko', 'torchic', 'mudkip'],
    },
    sinnoh: {
      description: 'A region based on Hokkaido, Japan, featuring Mt. Coronet at its center.',
      generation: 'Generation IV',
      starters: ['turtwig', 'chimchar', 'piplup'],
    },
    unova: {
      description: 'A diverse region far from Kanto featuring a large metropolitan area.',
      generation: 'Generation V',
      starters: ['snivy', 'tepig', 'oshawott'],
    },
    kalos: {
      description:
        'A region inspired by France, featuring Mega Evolution and the iconic Prism Tower.',
      generation: 'Generation VI',
      starters: ['chespin', 'fennekin', 'froakie'],
    },
    alola: {
      description: 'A tropical archipelago region featuring Alolan forms and island trials.',
      generation: 'Generation VII',
      starters: ['rowlet', 'litten', 'popplio'],
    },
    galar: {
      description: 'A region based on the United Kingdom featuring Dynamax and Gigantamax.',
      generation: 'Generation VIII',
      starters: ['grookey', 'scorbunny', 'sobble'],
    },
    paldea: {
      description: 'An open-world region featuring the Terastal phenomenon.',
      generation: 'Generation IX',
      starters: ['sprigatito', 'fuecoco', 'quaxly'],
    },
  }

export function RegionPage() {
  const { regionName } = useParams<{ regionName: string }>()
  const [region, setRegion] = useState<RegionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRegion = async () => {
      if (!regionName) return

      try {
        setLoading(true)
        const data = await pokeApi.getRegionDetails(regionName)
        setRegion(data)
      } catch (err) {
        setError('Failed to load region details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRegion()
  }, [regionName])

  const formatLocationName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getLocationType = (name: string) => {
    if (name.includes('route')) return 'Route'
    if (name.includes('city') || name.includes('town')) return 'Settlement'
    if (name.includes('cave') || name.includes('mt-') || name.includes('mount')) {
      return 'Cave/Mountain'
    }
    if (name.includes('forest') || name.includes('wood')) return 'Forest'
    if (name.includes('tower')) return 'Tower'
    return 'Area'
  }

  const getLocationColor = (type: string) => {
    const colors: Record<string, string> = {
      Route: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      Settlement: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      'Cave/Mountain': 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
      Forest: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      Tower: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      Area: 'bg-muted text-muted-foreground',
    }
    return colors[type] || colors['Area']
  }

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-[300px] mb-4" />
        <Skeleton className="h-4 w-[500px] mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !region) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error || 'Region not found'}</p>
        </div>
      </div>
    )
  }

  const info = regionInfo[region.name]

  return (
    <div className="container py-10">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Regions
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold tracking-tight capitalize">{region.name}</h1>
          <Badge variant="outline">{info?.generation || 'Unknown Generation'}</Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {info?.description ||
            `Explore the ${region.name} region and discover Pokemon encounters.`}
        </p>
      </div>

      {info?.starters && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Starter Pokemon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {info.starters.map(starter => (
                <Link
                  key={starter}
                  to={`/pokemon/${starter}`}
                  className="flex flex-col items-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getStarterId(starter)}.png`}
                    alt={starter}
                    className="w-20 h-20 object-contain"
                  />
                  <span className="capitalize text-sm mt-2 font-medium">{starter}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="locations">Locations ({region.locations.length})</TabsTrigger>
          <TabsTrigger value="pokedexes">Pokedexes ({region.pokedexes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="locations">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {region.locations.map(location => {
              const type = getLocationType(location.name)
              return (
                <Link key={location.name} to={`/location/${location.name}`}>
                  <Card className="group hover:shadow-md transition-all cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`${getLocationColor(type)}`}>
                          {type}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-lg mt-2">
                        {formatLocationName(location.name)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>View encounters</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="pokedexes">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {region.pokedexes.map(pokedex => (
              <Card key={pokedex.name}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">
                    {pokedex.name.split('-').join(' ')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Regional Pokedex for {region.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getStarterId(name: string): number {
  const starters: Record<string, number> = {
    bulbasaur: 1,
    charmander: 4,
    squirtle: 7,
    chikorita: 152,
    cyndaquil: 155,
    totodile: 158,
    treecko: 252,
    torchic: 255,
    mudkip: 258,
    turtwig: 387,
    chimchar: 390,
    piplup: 393,
    snivy: 495,
    tepig: 498,
    oshawott: 501,
    chespin: 650,
    fennekin: 653,
    froakie: 656,
    rowlet: 722,
    litten: 725,
    popplio: 728,
    grookey: 810,
    scorbunny: 813,
    sobble: 816,
    sprigatito: 906,
    fuecoco: 909,
    quaxly: 912,
  }
  return starters[name] || 1
}
