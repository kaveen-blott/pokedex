import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Pokémon Details</Text>
      <Text style={styles.subtitle}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 8,
    color: "#666",
  },
});
