import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ChevronRight } from 'lucide-react'
import { pokeApi, type Region } from '@/services/pokeApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const regionImages: Record<string, string> = {
  kanto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  johto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/157.png',
  hoenn: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
  sinnoh: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png',
  unova: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/500.png',
  kalos: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png',
  alola: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/730.png',
  galar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/815.png',
  paldea: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/906.png',
}

const regionColors: Record<string, string> = {
  kanto: 'bg-red-500/10 text-red-600 dark:text-red-400',
  johto: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  hoenn: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  sinnoh: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  unova: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  kalos: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  alola: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  galar: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  paldea: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

export function HomePage () {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true)
        const data = await pokeApi.getRegions()
        setRegions(data)
      } catch (err) {
        setError('Failed to load regions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRegions()
  }, [])

  const formatRegionName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="mb-8">
          <Skeleton className="h-10 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Pokemon Regions</h1>
        <p className="text-muted-foreground text-lg">
          Explore Pokemon locations, encounter areas, and discover where to find your favorite
          Pokemon
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {regions.map(region => (
          <Link key={region.name} to={`/region/${region.name}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`${regionColors[region.name] || 'bg-muted'} capitalize`}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Region
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-2xl mt-2">{formatRegionName(region.name)}</CardTitle>
                <CardDescription>Explore locations and encounters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-4">
                  {regionImages[region.name] ? (
                    <img
                      src={regionImages[region.name]}
                      alt={`${region.name} starter`}
                      className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
