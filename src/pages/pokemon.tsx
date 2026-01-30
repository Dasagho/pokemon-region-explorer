import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Ruler, Weight, Zap, Shield, Heart, Swords, Gauge } from 'lucide-react'
import { pokeApi, type Pokemon } from '@/services/pokeApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

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

const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
}

export function PokemonPage() {
  const { pokemonName } = useParams<{ pokemonName: string }>()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!pokemonName) return

      try {
        setLoading(true)
        const data = await pokeApi.getPokemon(pokemonName)
        setPokemon(data)
      } catch (err) {
        setError('Failed to load Pokemon details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [pokemonName])

  const getTotalStats = () => {
    if (!pokemon) return 0
    return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  }

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
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error || 'Pokemon not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Regions
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Image & Basic Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-muted to-muted/50 p-8">
                <div className="absolute top-4 right-4">
                  <span className="text-6xl font-bold text-muted-foreground/20">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </span>
                </div>
                <img
                  src={
                    pokemon.sprites.other['official-artwork'].front_default ||
                    pokemon.sprites.front_default ||
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                  }
                  alt={pokemon.name}
                  className="w-64 h-64 mx-auto object-contain drop-shadow-2xl"
                />
              </div>
              <div className="p-6">
                <h1 className="text-4xl font-bold capitalize mb-4">{pokemon.name}</h1>
                <div className="flex gap-2 mb-6">
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
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Base Stats</span>
                <Badge variant="secondary" className="text-lg">
                  Total: {getTotalStats()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pokemon.stats.map(stat => {
                const percentage = (stat.base_stat / 255) * 100
                return (
                  <div key={stat.stat.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {statIcons[stat.stat.name]}
                        <span className="text-sm font-medium">{statNames[stat.stat.name]}</span>
                      </div>
                      <span className="text-sm font-bold">{stat.base_stat}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pokemon.abilities?.map(ability => (
                  <div
                    key={ability.ability.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <span className="capitalize font-medium">
                      {ability.ability.name.split('-').join(' ')}
                    </span>
                    {ability.is_hidden && (
                      <Badge variant="outline" className="text-xs">
                        Hidden
                      </Badge>
                    )}
                  </div>
                )) || <p className="text-muted-foreground">No abilities data available</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
