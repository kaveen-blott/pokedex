import { StyleSheet, Text, View } from "react-native";

export default function Favorites() {
  return (
    <View style={styles.centered}>
      <Text>Favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
