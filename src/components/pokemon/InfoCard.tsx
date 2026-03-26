import { colors } from "@/src/lib/theme";
import { StyleSheet, Text, View } from "react-native";

export function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
  },
});
