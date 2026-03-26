import { useFavorites } from "@/src/lib/favorites";
import { getPokemonArtworkUrl } from "@/src/lib/pokeapi";
import { colors } from "@/src/lib/theme";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function FavoriteItem({ id }: { id: string }) {
  const name = `#${id.padStart(3, "0")}`;

  return (
    <Link href={{ pathname: "/(tabs)/pokedex/[id]", params: { id } }} asChild>
      <Pressable style={styles.item}>
        <Image
          source={{ uri: getPokemonArtworkUrl(id) }}
          style={styles.sprite}
          contentFit="contain"
          cachePolicy="memory-disk"
          transition={200}
        />
        <Text style={styles.itemId}>{name}</Text>
      </Pressable>
    </Link>
  );
}

export default function Favorites() {
  const { favorites } = useFavorites();
  const sorted = useMemo(
    () => [...favorites].sort((a, b) => Number(a) - Number(b)),
    [favorites],
  );

  if (sorted.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>{"<3"}</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart on a Pokémon to save it here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.grid}
    >
      {sorted.map((id) => (
        <FavoriteItem key={id} id={id} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    paddingBottom: 80,
  },
  item: {
    width: "33.333%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  sprite: {
    width: 72,
    height: 72,
  },
  itemId: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    gap: 8,
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 40,
    color: colors.textMuted,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
