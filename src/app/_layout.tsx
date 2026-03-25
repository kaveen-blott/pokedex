import { FavoritesProvider } from "@/src/lib/favorites";
import { defaultScreenOptions } from "@/src/lib/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack screenOptions={defaultScreenOptions}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </FavoritesProvider>
  );
}
