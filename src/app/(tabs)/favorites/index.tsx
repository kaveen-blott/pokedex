import { PokemonCard } from "@/src/components/PokemonCard";
import { useFavorites } from "@/src/lib/favorites";
import { fetchPokemonList, TOTAL_POKEMON } from "@/src/lib/pokeapi";
import { formatPokemonName } from "@/src/lib/pokemon-name";
import { colors } from "@/src/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type NameMap = Record<string, string>;

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();
  const [nameMap, setNameMap] = useState<NameMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonList(0, TOTAL_POKEMON)
      .then((results) => {
        const map: NameMap = {};
        for (const p of results) {
          const segments = p.url.replace(/\/$/, "").split("/");
          map[segments[segments.length - 1]] = p.name;
        }
        setNameMap(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...favorites].sort((a, b) => Number(a) - Number(b)),
    [favorites],
  );

  const handleLongPress = useCallback(
    (id: string, name: string) => {
      Alert.alert(
        "Remove Favorite",
        `Remove ${formatPokemonName(name)} from favorites?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => toggleFavorite(id),
          },
        ],
      );
    },
    [toggleFavorite],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    );
  }

  if (sorted.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart on a Pokémon's detail page to save it here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sorted}
      keyExtractor={(id) => id}
      numColumns={2}
      style={styles.list}
      contentContainerStyle={styles.grid}
      renderItem={({ item: id }) => (
        <View style={styles.cardWrapper}>
          <PokemonCard
            id={id}
            name={nameMap[id] ?? `Pokemon ${id}`}
            onLongPress={() => handleLongPress(id, nameMap[id] ?? id)}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/favorites/[id]",
                params: { id },
              })
            }
          />
        </View>
      )}
      ListFooterComponent={
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {sorted.length} {sorted.length === 1 ? "favorite" : "favorites"}
          </Text>
          <Text style={styles.footerHint}>Long press a card to remove</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  grid: {
    padding: 6,
    paddingBottom: 80,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: "50%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    gap: 12,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  footerHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
