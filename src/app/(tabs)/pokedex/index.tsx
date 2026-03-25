import { PokemonCard } from "@/src/components/PokemonCard";
import { fetchPokemonList, PAGE_SIZE, TOTAL_POKEMON } from "@/src/lib/pokeapi";
import { colors } from "@/src/lib/theme";
import type { Pokemon } from "@/src/types/pokemon";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function renderItem({ item }: ListRenderItemInfo<Pokemon>) {
  return <PokemonCard name={item.name} url={item.url} />;
}

function keyExtractor(item: Pokemon) {
  return item.url;
}

export default function Pokedex() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMore = useRef(true);

  const loadInitial = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPokemonList(0)
      .then((results) => {
        setPokemon(results);
        hasMore.current =
          results.length >= PAGE_SIZE && results.length < TOTAL_POKEMON;
      })
      .catch(() => setError("Failed to load Pokémon. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore.current) return;

    setLoadingMore(true);
    const offset = pokemon.length;
    const remaining = TOTAL_POKEMON - offset;
    const limit = Math.min(PAGE_SIZE, remaining);

    fetchPokemonList(offset, limit)
      .then((results) => {
        setPokemon((prev) => [...prev, ...results]);
        setError(null);
        hasMore.current =
          results.length >= PAGE_SIZE &&
          offset + results.length < TOTAL_POKEMON;
      })
      .catch(() => setError("Failed to load more Pokémon."))
      .finally(() => setLoadingMore(false));
  }, [loadingMore, pokemon.length]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={styles.loadingText}>Loading Pokédex…</Text>
      </View>
    );
  }

  if (error && pokemon.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadInitial}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlashList
      data={pokemon}
      keyExtractor={keyExtractor}
      numColumns={2}
      contentContainerStyle={{ padding: 12, paddingBottom: 64 }}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={colors.red} />
            <Text style={styles.footerText}>Loading more Pokémon…</Text>
          </View>
        ) : error ? (
          <View style={styles.footer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadMore}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : !hasMore.current ? (
          <View style={styles.footerDone}>
            <Text style={styles.footerDoneText}>
              You&apos;ve caught &apos;em all!
            </Text>
            <Text style={styles.footerDoneSubtext}>
              {pokemon.length} Pokémon discovered
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  footer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  footerDone: {
    paddingVertical: 28,
    alignItems: "center",
    gap: 4,
  },
  footerDoneText: {
    fontSize: 15,
    color: colors.red,
    fontWeight: "700",
  },
  footerDoneSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 14,
    color: colors.red,
    fontWeight: "500",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.red,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
