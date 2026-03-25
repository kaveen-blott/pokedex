export const colors = {
  // Primary Pokémon red
  red: "#DC0A2D",
  redDark: "#A00020",

  // Backgrounds
  backgroundLight: "#F5F5F5",
  backgroundCard: "#FFFFFF",

  // Text
  textPrimary: "#1A1A2E",
  textSecondary: "#6B6B80",
  textMuted: "#A0A0B0",

  // Accents
  border: "#E8E8EF",
  shadow: "rgba(0, 0, 0, 0.1)",

  // Tab bar
  tabActive: "#DC0A2D",
  tabInactive: "#9090A0",
} as const;

export const defaultScreenOptions = {
  headerStyle: { backgroundColor: colors.red },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "700" as const },
  contentStyle: { backgroundColor: colors.backgroundLight },
} as const;
