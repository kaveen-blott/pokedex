import { PokemonCard } from "@/src/components/PokemonCard";
import { fetchPokemonList } from "@/src/lib/pokeapi";
import type { Pokemon } from "@/src/types/pokemon";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function renderItem({ item }: ListRenderItemInfo<Pokemon>) {
  return <PokemonCard name={item.name} url={item.url} />;
}

function keyExtractor(item: Pokemon) {
  return item.url;
}

export default function Pokedex() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonList()
      .then(setPokemon)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );
  }

  return (
    <FlashList
      data={pokemon}
      keyExtractor={keyExtractor}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 12,
  },
});
