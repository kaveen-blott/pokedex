const POKEMON_NAME_MAP: Record<string, string> = {
  "nidoran-f": "Nidoran\u2640",
  "nidoran-m": "Nidoran\u2642",
  "mr-mime": "Mr. Mime",
  "deoxys-normal": "Deoxys",
  farfetchd: "Farfetch'd",
};

export function formatPokemonName(name: string): string {
  if (POKEMON_NAME_MAP[name]) return POKEMON_NAME_MAP[name];
  return name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * Normalize a Pokémon name for search comparison.
 * Strips dashes, dots, apostrophes, special chars, and lowercases.
 */
export function normalizePokemonName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s\-.'"\u2640\u2642]/g, "")
    .trim();
}
