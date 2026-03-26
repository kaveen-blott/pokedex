import { colors } from "@/src/lib/theme";
import { StyleSheet, Text, View } from "react-native";

export function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderCurve: "continuous",
    paddingHorizontal: 14,
    paddingVertical: 12,
    boxShadow: `0 1px 4px ${colors.shadow}`,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
