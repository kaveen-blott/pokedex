import { colors, defaultScreenOptions } from "@/src/lib/theme";
import { Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" options={{ title: "Favorites" }} />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          presentation: "formSheet",
          sheetAllowedDetents: [0.57, 0.98, 1.0],
          sheetCornerRadius: 24,
          sheetGrabberVisible: true,
          sheetExpandsWhenScrolledToEdge: true,
          contentStyle: { backgroundColor: colors.backgroundLight },
        }}
      />
    </Stack>
  );
}
