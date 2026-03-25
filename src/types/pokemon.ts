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

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
  base_experience: number;
}

export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: {
    name: string;
  };
  version: {
    name: string;
  };
}

export interface PokemonSpeciesGenus {
  genus: string;
  language: {
    name: string;
  };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  base_happiness: number;
  capture_rate: number;
  gender_rate: number;
  growth_rate: {
    name: string;
  };
  habitat: {
    name: string;
  } | null;
  egg_groups: {
    name: string;
  }[];
  genera: PokemonSpeciesGenus[];
  flavor_text_entries: PokemonSpeciesFlavorText[];
  evolution_chain: {
    url: string;
  };
  is_legendary: boolean;
  is_mythical: boolean;
}

export interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  chain: EvolutionChainLink;
}

export interface PokemonListResponse {
  results: Pokemon[];
}
