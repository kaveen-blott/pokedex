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
        <Icon
          sf={{ default: "list.bullet", selected: "list.bullet" }}
          drawable="ic_menu_sort_by_size"
        />
        <Label>Pokédex</Label>
      </NativeTabTrigger>
      <NativeTabTrigger name="favorites">
        <Icon
          sf={{ default: "heart", selected: "heart.fill" }}
          drawable="ic_menu_my_calendar"
        />
        <Label>Favorites</Label>
      </NativeTabTrigger>
    </NativeTabs>
  );
}
