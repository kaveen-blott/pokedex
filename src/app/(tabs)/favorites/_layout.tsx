import { defaultScreenOptions } from "@/src/lib/theme";
import { Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" options={{ title: "Favorites" }} />
    </Stack>
  );
}
