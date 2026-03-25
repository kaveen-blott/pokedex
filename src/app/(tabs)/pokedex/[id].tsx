import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Pokémon Details</Text>
      <Text style={{ marginTop: 8, color: "#666" }}>ID: {id}</Text>
    </View>
  );
}
