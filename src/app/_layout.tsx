import { defaultScreenOptions } from "@/src/lib/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
