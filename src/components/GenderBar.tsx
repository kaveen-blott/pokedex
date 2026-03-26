import { colors } from "@/src/lib/theme";
import { StyleSheet, Text, View } from "react-native";

export function GenderBar({ rate }: { rate: number }) {
  if (rate === -1) {
    return (
      <View style={styles.container}>
        <Text style={styles.genderless}>Genderless</Text>
      </View>
    );
  }

  const femalePercent = (rate / 8) * 100;
  const malePercent = 100 - femalePercent;

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <View style={styles.labelRow}>
          <View style={[styles.dot, { backgroundColor: "#5B9BD5" }]} />
          <Text style={styles.maleLabel}>
            Male {malePercent.toFixed(0)}%
          </Text>
        </View>
        <View style={styles.labelRow}>
          <View style={[styles.dot, { backgroundColor: "#F06292" }]} />
          <Text style={styles.femaleLabel}>
            Female {femalePercent.toFixed(0)}%
          </Text>
        </View>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.maleFill, { width: `${malePercent}%` }]} />
        <View
          style={[styles.femaleFill, { width: `${femalePercent}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  maleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5B9BD5",
  },
  femaleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F06292",
  },
  genderless: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
  },
  barBg: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  maleFill: {
    backgroundColor: "#5B9BD5",
    height: 10,
  },
  femaleFill: {
    backgroundColor: "#F06292",
    height: 10,
  },
});
