import { PokemonCard } from "@/src/components/PokemonCard";
import { fetchPokemonList, PAGE_SIZE, TOTAL_POKEMON } from "@/src/lib/pokeapi";
import { colors } from "@/src/lib/theme";
import type { Pokemon } from "@/src/types/pokemon";
import { Ionicons } from "@expo/vector-icons";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function renderItem({ item }: ListRenderItemInfo<Pokemon>) {
  return <PokemonCard name={item.name} url={item.url} />;
}

function keyExtractor(item: Pokemon) {
  return item.url;
}

export default function Pokedex() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const loadAll = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPokemonList(0, TOTAL_POKEMON)
      .then((results) => setAllPokemon(results))
      .catch(() => setError("Failed to load Pokémon. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return allPokemon;
    return allPokemon.filter((p) => p.name.includes(query));
  }, [allPokemon, debouncedSearch]);

  const displayedPokemon = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;

  // Reset visible count when debounced search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  }, [hasMore, filtered.length]);

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 300);
  }, []);

  const clearSearch = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearch("");
    setDebouncedSearch("");
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={styles.loadingText}>Loading Pokédex…</Text>
      </View>
    );
  }

  if (error && allPokemon.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadAll}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Pokémon..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 ? (
            <Pressable onPress={clearSearch} hitSlop={8}>
              <Text style={styles.clearButton}>✕</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlashList
        data={displayedPokemon}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={{ padding: 12, paddingBottom: 64 }}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Pokémon found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.red} />
              <Text style={styles.footerText}>Loading more Pokémon…</Text>
            </View>
          ) : filtered.length > 0 && !search ? (
            <View style={styles.footerDone}>
              <Text style={styles.footerDoneText}>
                You&apos;ve caught &apos;em all!
              </Text>
              <Text style={styles.footerDoneSubtext}>
                {filtered.length} Pokémon discovered
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderCurve: "continuous",
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
    padding: 0,
  },
  clearButton: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 6,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
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
