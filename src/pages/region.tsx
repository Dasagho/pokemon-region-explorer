import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, ChevronRight, Sparkles } from 'lucide-react'
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

const regionColors: Record<string, { bg: string; text: string; gradient: string }> = {
  kanto: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500 to-orange-500',
  },
  johto: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-yellow-500',
  },
  hoenn: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
  },
  sinnoh: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    gradient: 'from-cyan-500 to-teal-500',
  },
  unova: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-indigo-500',
  },
  kalos: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
  },
  alola: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-red-500',
  },
  galar: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-purple-500',
  },
  paldea: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-green-500',
  },
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

export function RegionPage () {
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
          <p className="text-muted-foreground">{error || 'Region not found'}</p>
        </motion.div>
      </div>
    )
  }

  const info = regionInfo[region.name]
  const colors = regionColors[region.name] || {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    gradient: 'from-gray-500 to-gray-600',
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}/20`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative container py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="ghost" className="mb-6 -ml-2" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Regions
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight capitalize">
                {region.name}
              </h1>
              <Badge
                variant="secondary"
                className={`${colors.bg} ${colors.text} w-fit text-sm px-3 py-1`}
              >
                {info?.generation || 'Unknown Generation'}
              </Badge>
            </div>

            <p className="text-muted-foreground text-lg max-w-2xl">
              {info?.description ||
                `Explore the ${region.name} region and discover Pokemon encounters.`}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container pb-16">
        {/* Starters */}
        {info?.starters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold mb-4">Starter Pokemon</h2>
            <div className="flex flex-wrap gap-4">
              {info.starters.map((starter, index) => (
                <motion.div
                  key={starter}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link to={`/pokemon/${starter}`}>
                    <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 card-lift overflow-hidden">
                      <CardContent className="p-4 flex flex-col items-center">
                        <motion.img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getStarterId(starter)}.png`}
                          alt={starter}
                          className="w-24 h-24 object-contain mb-2"
                          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="capitalize text-sm font-medium group-hover:text-primary transition-colors">
                          {starter}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="locations" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="locations" className="gap-2">
                <MapPin className="h-4 w-4" />
                Locations ({region.locations.length})
              </TabsTrigger>
              <TabsTrigger value="pokedexes">Pokedexes ({region.pokedexes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="locations">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {region.locations.map(location => {
                  const type = getLocationType(location.name)
                  return (
                    <motion.div key={location.name} variants={cardVariants}>
                      <Link to={`/location/${location.name}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-0 shadow-md card-lift">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className={`${getLocationColor(type)}`}>
                                {type}
                              </Badge>
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            </div>
                            <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">
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
                    </motion.div>
                  )
                })}
              </motion.div>
            </TabsContent>

            <TabsContent value="pokedexes">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {region.pokedexes.map(pokedex => (
                  <motion.div key={pokedex.name} variants={cardVariants}>
                    <Card className="border-0 shadow-md">
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
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>
    </div>
  )
}

function getStarterId (name: string): number {
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
