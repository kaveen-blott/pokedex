import { colors } from "@/src/lib/theme";
import { StyleSheet, Text, View } from "react-native";

export function StatMeter({
  value,
  maxValue,
  label,
  color,
}: {
  value: number;
  maxValue: number;
  label: string;
  color: string;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
