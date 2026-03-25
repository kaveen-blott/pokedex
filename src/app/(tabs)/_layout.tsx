import {
  Icon,
  Label,
  NativeTabs,
  NativeTabTrigger,
} from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabTrigger name="pokedex">
        <Icon sf={{ default: "list.bullet", selected: "list.bullet" }} />
        <Label>Pokédex</Label>
      </NativeTabTrigger>
      <NativeTabTrigger name="favorites">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>Favorites</Label>
      </NativeTabTrigger>
    </NativeTabs>
  );
}
