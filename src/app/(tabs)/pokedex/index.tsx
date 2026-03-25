import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Pokedex() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text>Pokédex</Text>
      <Link
        href={{ pathname: "/(tabs)/pokedex/[id]", params: { id: "25" } }}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: "#e3350d",
          borderRadius: 8,
          color: "#fff",
          fontWeight: "600",
          overflow: "hidden",
        }}
      >
        View Pikachu
      </Link>
    </View>
  );
}
