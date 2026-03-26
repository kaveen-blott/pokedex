import type {
  EvolutionChain,
  Pokemon,
  PokemonDetails,
  PokemonListResponse,
  PokemonSpecies,
} from "@/src/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export function getPokemonId(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

export function getPokemonSpriteUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonArtworkUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export const PAGE_SIZE = 50;
export const TOTAL_POKEMON = 151;

export async function fetchPokemonList(
  offset = 0,
  limit = PAGE_SIZE,
): Promise<Pokemon[]> {
  const res = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
  );
  if (!res.ok) {
    throw new Error(`PokéAPI error: ${res.status} ${res.statusText}`);
  }
  const data: PokemonListResponse = await res.json();
  return data.results;
}

export async function fetchPokemonDetails(id: string): Promise<PokemonDetails> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`PokéAPI error: ${res.status} ${res.statusText}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate network delay
  return res.json();
}

export async function fetchPokemonSpecies(id: string): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!res.ok) {
    throw new Error(`PokéAPI error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchEvolutionChain(
  url: string,
): Promise<EvolutionChain> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`PokéAPI error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};
