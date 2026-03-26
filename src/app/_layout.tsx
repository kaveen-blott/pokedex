import { FavoritesProvider } from "@/src/lib/favorites";
import { colors, defaultScreenOptions } from "@/src/lib/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack screenOptions={defaultScreenOptions}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
    </FavoritesProvider>
  );
}
