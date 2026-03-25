import { getPokemonId, getPokemonSpriteUrl } from "@/src/lib/pokeapi";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PokemonCard({ name, url }: { name: string; url: string }) {
  const id = getPokemonId(url);

  return (
    <Link href={{ pathname: "/(tabs)/pokedex/[id]", params: { id } }} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.id}>#{id.padStart(3, "0")}</Text>
        <Image
          source={{ uri: getPokemonSpriteUrl(id) }}
          style={styles.sprite}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={id}
        />
        <Text style={styles.name}>{capitalize(name)}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
    margin: 6,
    gap: 4,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderCurve: "continuous",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
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
  },
});
