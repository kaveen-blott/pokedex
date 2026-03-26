import { PokemonDetailContent } from "@/src/components/pokemon";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback } from "react";

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const handleTitleResolved = useCallback(
    (title: string) => {
      navigation.setOptions({ title });
    },
    [navigation],
  );

  const handleExploreMoreStats = useCallback(
    (pokemonId: string) => {
      router.push({
        pathname: "/stats-modal",
        params: { id: pokemonId, origin: "pokedex" },
      });
    },
    [router],
  );

  return (
    <PokemonDetailContent
      id={id ?? ""}
      onTitleResolved={handleTitleResolved}
      onExploreMoreStats={handleExploreMoreStats}
    />
  );
}
