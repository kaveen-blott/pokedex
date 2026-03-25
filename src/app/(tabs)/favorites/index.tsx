import { colors } from "@/src/lib/theme";
import { StyleSheet, Text, View } from "react-native";

export default function Favorites() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{"<3"}</Text>
      <Text style={styles.title}>No Favorites Yet</Text>
      <Text style={styles.subtitle}>
        Tap the heart on a Pokémon to save it here
      </Text>
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
    padding: 32,
  },
  emoji: {
    fontSize: 40,
    color: colors.textMuted,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
