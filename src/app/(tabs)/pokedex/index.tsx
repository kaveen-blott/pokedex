import {
  fetchPokemonList,
  getPokemonId,
  getPokemonSpriteUrl,
} from "@/src/lib/pokeapi";
import type { Pokemon } from "@/src/types/pokemon";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Pokedex() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPokemon = useCallback(async () => {
    try {
      const results = await fetchPokemonList();
      setPokemon(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemon();
  }, [loadPokemon]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );
  }

  return (
    <FlatList
      data={pokemon}
      keyExtractor={(item) => item.url}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => {
        const id = getPokemonId(item.url);
        return (
          <Link href={{ pathname: "/(tabs)/pokedex/[id]", params: { id } }} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.id}>#{id.padStart(3, "0")}</Text>
              <Image
                source={{ uri: getPokemonSpriteUrl(id) }}
                style={styles.sprite}
                contentFit="contain"
              />
              <Text style={styles.name}>{capitalize(item.name)}</Text>
            </Pressable>
          </Link>
        );
      }}
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
  columnWrapper: {
    gap: 12,
  },
  card: {
    flex: 1,
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sprite: {
    width: 72,
    height: 72,
  },
  id: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "700",
    alignSelf: "flex-end",
    marginRight: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
});
