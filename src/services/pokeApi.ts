const API_BASE = 'https://pokeapi.co/api/v2'
const DEFAULT_CACHE_TTL = 5 * 60 * 1000
const MAX_SEARCH_CACHE_SIZE = 50

interface CacheEntry<T> {
  data: T
  expiry: number
}

export interface Region {
  name: string
  url: string
}

export interface LocalizedName {
  name: string
  language: {
    name: string
    url: string
  }
}

export interface RegionDetails {
  id: number
  name: string
  names: LocalizedName[]
  locations: Location[]
  main_generation: {
    name: string
    url: string
  }
  pokedexes: {
    name: string
    url: string
  }[]
}

export interface Location {
  name: string
  url: string
}

export interface LocationDetails {
  id: number
  name: string
  names: LocalizedName[]
  region: {
    name: string
    url: string
  }
  areas: LocationArea[]
}

export interface LocationArea {
  name: string
  url: string
}

export interface LocationAreaDetails {
  id: number
  name: string
  location: {
    name: string
    url: string
  }
  pokemon_encounters: PokemonEncounter[]
}

export interface PokemonEncounter {
  pokemon: {
    name: string
    url: string
  }
  version_details: VersionDetail[]
}

export interface VersionDetail {
  version: {
    name: string
    url: string
  }
  max_chance: number
  encounter_details: EncounterDetail[]
}

export interface EncounterDetail {
  min_level: number
  max_level: number
  chance: number
  method: {
    name: string
    url: string
  }
  condition_values: {
    name: string
    url: string
  }[]
}

export interface Pokemon {
  id: number
  name: string
  names?: LocalizedName[]
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other: {
      'official-artwork': {
        front_default: string | null
      }
    }
  }
  types: {
    slot: number
    type: {
      name: string
      url: string
    }
  }[]
  stats: {
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }[]
  abilities: {
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
    slot: number
  }[]
}

export interface Ability {
  id: number
  name: string
  names: LocalizedName[]
  effect_entries: {
    effect: string
    short_effect: string
    language: {
      name: string
      url: string
    }
  }[]
}

export interface LocalizedAbility {
  name: string
  effect: string
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonLocation {
  location_area: {
    name: string
    url: string
  }
  version_details: {
    version: {
      name: string
      url: string
    }
    max_chance: number
    encounter_details: {
      min_level: number
      max_level: number
      chance: number
      method: {
        name: string
        url: string
      }
    }[]
  }[]
}

class PokeApiService {
  private cache = new Map<string, CacheEntry<unknown>>()
  private searchCache = new Map<string, Pokemon[]>()
  private allPokemonCache: PokemonListItem[] | null = null

  private getCached<T> (key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (entry && entry.expiry > Date.now()) {
      return entry.data
    }
    return null
  }

  private setCache<T> (key: string, data: T, ttl = DEFAULT_CACHE_TTL): void {
    this.cache.set(key, { data, expiry: Date.now() + ttl })
  }

  private async fetch<T> (url: string, useCache = true, signal?: AbortSignal): Promise<T> {
    const cached = this.getCached<T>(url)
    if (useCache && cached) {
      return cached
    }

    const response = await fetch(url, { signal })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    this.setCache(url, data)
    return data
  }

  async getRegions (): Promise<Region[]> {
    const data = await this.fetch<{ results: Region[] }>(`${API_BASE}/region`)
    return data.results
  }

  async getRegionDetails (name: string): Promise<RegionDetails> {
    return this.fetch<RegionDetails>(`${API_BASE}/region/${name}`)
  }

  async getLocationDetails (name: string): Promise<LocationDetails> {
    return this.fetch<LocationDetails>(`${API_BASE}/location/${name}`)
  }

  async getLocationAreaDetails (name: string): Promise<LocationAreaDetails> {
    return this.fetch<LocationAreaDetails>(`${API_BASE}/location-area/${name}`)
  }

  async getLocationOrAreaDetails (name: string): Promise<LocationDetails | LocationAreaDetails> {
    try {
      return await this.fetch<LocationAreaDetails>(`${API_BASE}/location-area/${name}`)
    } catch {
      return this.fetch<LocationDetails>(`${API_BASE}/location/${name}`)
    }
  }

  async getPokemon (name: string, options?: { signal?: AbortSignal }): Promise<Pokemon> {
    return this.fetch<Pokemon>(`${API_BASE}/pokemon/${name}`, true, options?.signal)
  }

  async getAbility (name: string, signal?: AbortSignal): Promise<Ability> {
    return this.fetch<Ability>(`${API_BASE}/ability/${name}`, true, signal)
  }

  async getAbilitiesLocalized (
    abilityNames: string[],
    signal?: AbortSignal,
  ): Promise<Map<string, LocalizedAbility>> {
    const localized = new Map<string, LocalizedAbility>()
    const batchSize = 5
    for (let i = 0; i < abilityNames.length; i += batchSize) {
      const batch = abilityNames.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(name => this.getAbility(name, signal).catch(() => null)),
      )
      results.forEach(ability => {
        if (ability) {
          const spanishName = ability.names.find(n => n.language.name === 'es')?.name
          const englishName = ability.names.find(n => n.language.name === 'en')?.name

          const spanishEffect =
            ability.effect_entries.find(e => e.language.name === 'es')?.short_effect ||
            ability.effect_entries.find(e => e.language.name === 'es')?.effect
          const englishEffect =
            ability.effect_entries.find(e => e.language.name === 'en')?.short_effect ||
            ability.effect_entries.find(e => e.language.name === 'en')?.effect

          localized.set(ability.name, {
            name: spanishName || englishName || ability.name,
            effect: spanishEffect || englishEffect || '',
          })
        }
      })
    }
    return localized
  }

  async getPokemonLocations (pokemonName: string): Promise<PokemonLocation[]> {
    const data = await this.fetch<{ location_area_encounters: string }>(
      `${API_BASE}/pokemon/${pokemonName}`,
    )
    if (!data.location_area_encounters) return []

    const encounters = await this.fetch<PokemonLocation[]>(data.location_area_encounters)
    return encounters
  }

  getPokemonSpriteUrl (id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }

  getLocalizedName (
    names: LocalizedName[] | undefined,
    languageCode: string,
    fallback?: string,
  ): string {
    if (!names || names.length === 0) {
      return fallback || ''
    }

    const localized = names.find(n => n.language.name === languageCode)
    if (localized) return localized.name

    const english = names.find(n => n.language.name === 'en')
    if (english) return english.name

    return names[0]?.name || fallback || ''
  }

  async getAllPokemonNames (signal?: AbortSignal): Promise<PokemonListItem[]> {
    if (this.allPokemonCache) {
      return this.allPokemonCache
    }

    const allPokemon: PokemonListItem[] = []
    let nextUrl: string | null = `${API_BASE}/pokemon?limit=1000`

    while (nextUrl) {
      const response = await fetch(nextUrl, { signal })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      allPokemon.push(...data.results)
      nextUrl = data.next
    }

    this.allPokemonCache = allPokemon
    return allPokemon
  }

  async searchPokemonByName (query: string, signal?: AbortSignal): Promise<Pokemon[]> {
    if (!query.trim()) return []

    const cacheKey = query.toLowerCase().trim()
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!
    }

    const searchTerm = cacheKey
    const allPokemon = await this.getAllPokemonNames(signal)

    const matchedNames = allPokemon.filter(p => p.name.includes(searchTerm)).slice(0, 20)

    const results: Pokemon[] = []
    const batchSize = 5
    for (let i = 0; i < matchedNames.length; i += batchSize) {
      const batch = matchedNames.slice(i, i + batchSize)
      const promises = batch.map(p => {
        const name = p.name
        if (results.find(r => r.name === name)) return Promise.resolve(null)
        return this.getPokemon(name, { signal }).catch(() => null)
      })
      const batchResults = await Promise.all(promises)
      batchResults.forEach(p => {
        if (p && !results.find(r => r.id === p.id)) {
          results.push(p)
        }
      })
    }

    if (this.searchCache.size >= MAX_SEARCH_CACHE_SIZE) {
      const firstKey = this.searchCache.keys().next().value
      if (firstKey) this.searchCache.delete(firstKey)
    }
    this.searchCache.set(cacheKey, results)
    return results
  }
}

export const pokeApi = new PokeApiService()
