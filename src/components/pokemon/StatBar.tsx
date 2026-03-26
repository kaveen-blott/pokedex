import { colors } from "@/src/lib/theme";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const STAT_MAX = 255;

function getStatColor(value: number): string {
  if (value < 50) return "#F44336";
  if (value < 80) return "#FF9800";
  if (value < 100) return "#FFC107";
  if (value < 130) return "#8BC34A";
  return "#4CAF50";
}

export function StatBar({
  label,
  value,
  index = 0,
}: {
  label: string;
  value: number;
  index?: number;
}) {
  const percentage = Math.min((value / STAT_MAX) * 100, 100);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      500 + index * 80,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [progress, index]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  const color = getStatColor(value);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            { width: `${percentage}%`, backgroundColor: color },
            barStyle,
          ]}
        />
      </View>
    </View>
  );
}

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "SPD",
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    width: 36,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  value: {
    width: 32,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
  },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
});
