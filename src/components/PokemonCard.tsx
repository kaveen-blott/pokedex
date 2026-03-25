import { useFavorites } from "@/src/lib/favorites";
import { getPokemonId, getPokemonSpriteUrl } from "@/src/lib/pokeapi";
import { colors } from "@/src/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PokemonCard({ name, url }: { name: string; url: string }) {
  const id = getPokemonId(url);
  const { isFavorite } = useFavorites();
  const favorited = isFavorite(id);

  return (
    <Link href={{ pathname: "/(tabs)/pokedex/[id]", params: { id } }} asChild>
      <Pressable style={styles.card}>
        <View style={styles.idBadge}>
          {favorited ? (
            <Ionicons name="heart" size={14} color={colors.red} />
          ) : null}
          <Text style={styles.idText}>#{id.padStart(3, "0")}</Text>
        </View>
        <View style={styles.spriteContainer}>
          <Image
            source={{ uri: getPokemonSpriteUrl(id) }}
            style={styles.sprite}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            recyclingKey={id}
          />
        </View>
        <View style={[styles.nameContainer, favorited && styles.nameContainerFavorite]}>
          <Text style={styles.name}>{capitalize(name)}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 6,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderCurve: "continuous",
    boxShadow: `0 2px 12px ${colors.shadow}`,
    overflow: "hidden",
  },
  idBadge: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    marginRight: 8,
  },
  idText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  spriteContainer: {
    alignItems: "center",
    paddingVertical: 4,
  },
  sprite: {
    width: 80,
    height: 80,
  },
  nameContainer: {
    backgroundColor: colors.red,
    paddingVertical: 10,
    alignItems: "center",
  },
  nameContainerFavorite: {
    backgroundColor: colors.redDark,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
