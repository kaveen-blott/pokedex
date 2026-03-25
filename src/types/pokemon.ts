export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  back_default: string;
  back_shiny: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: PokemonSprites;
}

export interface PokemonListResponse {
  results: Pokemon[];
}
