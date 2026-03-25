import type { Pokemon, PokemonListResponse } from "@/src/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export function getPokemonId(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

export function getPokemonSpriteUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function fetchPokemonList(limit = 151): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
  const data: PokemonListResponse = await res.json();
  return data.results;
}
