import { useFavorites } from "@/src/lib/favorites";
import { getPokemonId, getPokemonSpriteUrl } from "@/src/lib/pokeapi";
import { formatPokemonName } from "@/src/lib/pokemon-name";
import { colors } from "@/src/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type PokemonCardProps = {
  name: string;
  onLongPress?: () => void;
} & ({ url: string; id?: never } | { id: string; url?: never });

export function PokemonCard(props: PokemonCardProps) {
  const id = props.id ?? getPokemonId(props.url!);
  const { name, onLongPress } = props;
  const { isFavorite } = useFavorites();
  const favorited = isFavorite(id);

  return (
    <Link href={{ pathname: "/(tabs)/pokedex/[id]", params: { id } }} asChild>
      <Pressable style={styles.card} onLongPress={onLongPress}>
        <View style={styles.idBadge}>
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
        <View
          style={[
            styles.nameContainer,
            favorited && styles.nameContainerFavorite,
          ]}
        >
          {favorited ? <Ionicons name="star" size={14} color="#fff" /> : null}
          <Text style={styles.name}>{formatPokemonName(name)}</Text>
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
    flexDirection: "row",
    backgroundColor: colors.red,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  nameContainerFavorite: {
    backgroundColor: colors.favorite,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
