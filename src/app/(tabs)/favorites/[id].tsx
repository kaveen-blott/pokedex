import { PokemonDetailContent } from "@/src/components/pokemon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

export default function FavoriteDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleExploreMoreStats = useCallback(
    (pokemonId: string) => {
      router.push({
        pathname: "/stats-modal",
        params: { id: pokemonId, origin: "favorites" },
      });
    },
    [router],
  );

  return (
    <PokemonDetailContent
      id={id ?? ""}
      onExploreMoreStats={handleExploreMoreStats}
    />
  );
}
