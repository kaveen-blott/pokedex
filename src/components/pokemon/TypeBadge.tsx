import { TYPE_COLORS } from "@/src/lib/pokeapi";
import { formatPokemonName } from "@/src/lib/pokemon-name";
import { colors } from "@/src/lib/theme";
import { StyleSheet, Text, View } from "react-native";

function hexToLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastTextColor(bgHex: string): string {
  return hexToLuminance(bgHex) > 0.4 ? "#2E2E2E" : "#FFFFFF";
}

export function TypeBadge({ name }: { name: string }) {
  const bgColor = TYPE_COLORS[name] ?? colors.textMuted;
  const textColor = getContrastTextColor(bgColor);

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {formatPokemonName(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});
