import type { Pokemon, PokemonListResponse } from "@/src/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export function getPokemonId(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

export function getPokemonSpriteUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export const PAGE_SIZE = 30;
export const TOTAL_POKEMON = 151;

export async function fetchPokemonList(
  offset = 0,
  limit = PAGE_SIZE,
): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!res.ok) {
    throw new Error(`PokéAPI error: ${res.status} ${res.statusText}`);
  }
  const data: PokemonListResponse = await res.json();
  return data.results;
}
