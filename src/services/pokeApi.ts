const API_BASE = 'https://pokeapi.co/api/v2'

export interface Region {
  name: string
  url: string
}

export interface RegionDetails {
  id: number
  name: string
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
  private async fetch<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async getRegions(): Promise<Region[]> {
    const data = await this.fetch<{ results: Region[] }>(`${API_BASE}/region`)
    return data.results
  }

  async getRegionDetails(name: string): Promise<RegionDetails> {
    return this.fetch<RegionDetails>(`${API_BASE}/region/${name}`)
  }

  async getLocationDetails(name: string): Promise<LocationDetails> {
    return this.fetch<LocationDetails>(`${API_BASE}/location/${name}`)
  }

  async getLocationAreaDetails(name: string): Promise<LocationAreaDetails> {
    return this.fetch<LocationAreaDetails>(`${API_BASE}/location-area/${name}`)
  }

  async getPokemon(name: string): Promise<Pokemon> {
    return this.fetch<Pokemon>(`${API_BASE}/pokemon/${name}`)
  }

  getPokemonSpriteUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }
}

export const pokeApi = new PokeApiService()
