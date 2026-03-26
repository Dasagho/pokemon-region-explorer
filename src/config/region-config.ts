export interface RegionConfig {
  name: string
  generation: string
  starters: string[]
  starterIds: number[]
  colors: {
    bg: string
    text: string
    gradient: string
    gradientHover: string
  }
  imageUrl: string
}

export const REGION_CONFIG: Record<string, RegionConfig> = {
  kanto: {
    name: 'kanto',
    generation: 'Generation I',
    starters: ['bulbasaur', 'charmander', 'squirtle'],
    starterIds: [1, 4, 7],
    colors: {
      bg: 'bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      gradient: 'from-red-500 to-orange-500',
      gradientHover: 'from-red-500/20 to-orange-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  },
  johto: {
    name: 'johto',
    generation: 'Generation II',
    starters: ['chikorita', 'cyndaquil', 'totodile'],
    starterIds: [152, 155, 158],
    colors: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-yellow-500',
      gradientHover: 'from-amber-500/20 to-yellow-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png',
  },
  hoenn: {
    name: 'hoenn',
    generation: 'Generation III',
    starters: ['treecko', 'torchic', 'mudkip'],
    starterIds: [252, 255, 258],
    colors: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
      gradientHover: 'from-blue-500/20 to-cyan-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/260.png',
  },
  sinnoh: {
    name: 'sinnoh',
    generation: 'Generation IV',
    starters: ['turtwig', 'chimchar', 'piplup'],
    starterIds: [387, 390, 393],
    colors: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-600 dark:text-cyan-400',
      gradient: 'from-cyan-500 to-teal-500',
      gradientHover: 'from-cyan-500/20 to-teal-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/392.png',
  },
  unova: {
    name: 'unova',
    generation: 'Generation V',
    starters: ['snivy', 'tepig', 'oshawott'],
    starterIds: [495, 498, 501],
    colors: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      gradientHover: 'from-purple-500/20 to-indigo-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/500.png',
  },
  kalos: {
    name: 'kalos',
    generation: 'Generation VI',
    starters: ['chespin', 'fennekin', 'froakie'],
    starterIds: [650, 653, 656],
    colors: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-600 dark:text-pink-400',
      gradient: 'from-pink-500 to-rose-500',
      gradientHover: 'from-pink-500/20 to-rose-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png',
  },
  alola: {
    name: 'alola',
    generation: 'Generation VII',
    starters: ['rowlet', 'litten', 'popplio'],
    starterIds: [722, 725, 728],
    colors: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-orange-500 to-red-500',
      gradientHover: 'from-orange-500/20 to-red-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png',
  },
  galar: {
    name: 'galar',
    generation: 'Generation VIII',
    starters: ['grookey', 'scorbunny', 'sobble'],
    starterIds: [810, 813, 816],
    colors: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500',
      gradientHover: 'from-indigo-500/20 to-purple-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/815.png',
  },
  paldea: {
    name: 'paldea',
    generation: 'Generation IX',
    starters: ['sprigatito', 'fuecoco', 'quaxly'],
    starterIds: [906, 909, 912],
    colors: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-green-500',
      gradientHover: 'from-emerald-500/20 to-green-500/20',
    },
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png',
  },
}

export const DEFAULT_REGION_COLORS = {
  bg: 'bg-muted',
  text: 'text-muted-foreground',
  gradient: 'from-gray-500 to-gray-600',
  gradientHover: 'from-gray-500/20 to-gray-600/20',
}

export function getRegionConfig (regionName: string): RegionConfig | undefined {
  return REGION_CONFIG[regionName]
}

export function getStarterId (regionName: string, starterIndex: number): number {
  const config = REGION_CONFIG[regionName]
  return config?.starterIds[starterIndex] ?? 1
}

export function getRegionColors (regionName: string) {
  return REGION_CONFIG[regionName]?.colors ?? DEFAULT_REGION_COLORS
}

export function getRegionImageUrl (regionName: string): string | undefined {
  return REGION_CONFIG[regionName]?.imageUrl
}
