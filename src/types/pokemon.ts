export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: PokemonSprites;
}

export interface PokemonListResponse {
  results: Pokemon[];
}
