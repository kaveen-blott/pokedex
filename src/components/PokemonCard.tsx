import { getPokemonId, getPokemonSpriteUrl } from "@/src/lib/pokeapi";
import { colors } from "@/src/lib/theme";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PokemonCard({ name, url }: { name: string; url: string }) {
  const id = getPokemonId(url);

  return (
    <Link href={{ pathname: "/(tabs)/pokedex/[id]", params: { id } }} asChild>
      <Pressable style={styles.card}>
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
        <View style={styles.nameContainer}>
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
    alignSelf: "flex-end",
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
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
