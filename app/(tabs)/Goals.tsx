import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { Goals } from "../../components/Goals"; // 1. Import your component

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {/* 2. Add your FoodSearch component here! */}
      <Goals />

      {/* You can remove this template component */}
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 0, // Add some padding
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
  },
});
