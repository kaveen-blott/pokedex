import { colors } from "@/src/lib/theme";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>#{id?.padStart(3, "0")}</Text>
      </View>
      <Text style={styles.title}>Pokémon Details</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    gap: 8,
  },
  badge: {
    backgroundColor: colors.red,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderCurve: "continuous",
    marginBottom: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
