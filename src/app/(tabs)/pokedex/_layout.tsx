import { colors, defaultScreenOptions } from "@/src/lib/theme";
import { Stack } from "expo-router";

export default function PokedexLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" options={{ title: "Pokédex" }} />
      <Stack.Screen name="[id]" options={{ title: "Details" }} />
      <Stack.Screen
        name="stats-modal"
        options={{
          title: "",
          headerShown: false,
          presentation: "formSheet",
          sheetAllowedDetents: [0.85, 1.0],
          sheetCornerRadius: 24,
          sheetGrabberVisible: true,
          sheetExpandsWhenScrolledToEdge: true,
          contentStyle: { backgroundColor: colors.backgroundLight },
        }}
      />
    </Stack>
  );
}
