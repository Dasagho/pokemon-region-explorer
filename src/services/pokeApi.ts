const API_BASE = 'https://pokeapi.co/api/v2'

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
  names?: LocalizedName[]  // Optional - only available from pokemon-species endpoint
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

class PokeApiService {
  private async fetch<T> (url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
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
    // Try location-area first (most specific areas use this endpoint)
    try {
      return await this.fetch<LocationAreaDetails>(`${API_BASE}/location-area/${name}`)
    } catch {
      // If location-area fails, try location endpoint
      return this.fetch<LocationDetails>(`${API_BASE}/location/${name}`)
    }
  }

  async getPokemon (name: string): Promise<Pokemon> {
    return this.fetch<Pokemon>(`${API_BASE}/pokemon/${name}`)
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

  // Helper function to get localized name from API response
  getLocalizedName (names: LocalizedName[] | undefined, languageCode: string, fallback?: string): string {
    // If no names array provided, return fallback
    if (!names || names.length === 0) {
      return fallback || ''
    }

    // Try to find name in requested language
    const localized = names.find(n => n.language.name === languageCode)
    if (localized) return localized.name

    // Fallback to English
    const english = names.find(n => n.language.name === 'en')
    if (english) return english.name

    // Last resort: return first available name or empty string
    return names[0]?.name || fallback || ''
  }

  // Search Pokemon by trying to fetch them directly - efficient on-demand search
  async searchPokemonByName (query: string): Promise<Pokemon[]> {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase().trim()
    const results: Pokemon[] = []

    // Try exact match first
    try {
      const exactMatch = await this.getPokemon(searchTerm)
      results.push(exactMatch)
    } catch {
      // Exact match not found, continue with variations
    }

    // Common Pokemon name patterns to try
    const variations = [
      searchTerm,
      `${searchTerm}-male`,
      `${searchTerm}-female`,
      `${searchTerm}-ordinary`,
      `${searchTerm}-incarnate`,
      `${searchTerm}-altered`,
      `${searchTerm}-land`,
    ]

    // Try variations (limit to avoid too many requests)
    const promises = variations.slice(0, 5).map(async name => {
      if (name === searchTerm && results.length > 0) return // Skip if already found
      try {
        const pokemon = await this.getPokemon(name)
        return pokemon
      } catch {
        return null
      }
    })

    const found = await Promise.all(promises)
    found.forEach(pokemon => {
      if (pokemon && !results.find(p => p.id === pokemon.id)) {
        results.push(pokemon)
      }
    })

    return results
  }
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

export const pokeApi = new PokeApiService()
