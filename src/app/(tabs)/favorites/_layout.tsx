import { colors } from "@/src/lib/theme";
import { Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.red },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: colors.backgroundLight },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Favorites" }} />
    </Stack>
  );
}
