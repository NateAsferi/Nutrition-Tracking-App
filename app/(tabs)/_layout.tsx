import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

// 1. --- ADD THIS IMPORT ---
import { NutritionProvider } from "../../context/NutritionContext"; // Adjust path if needed
import { Ionicons } from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // 2. --- WRAP YOUR TABS IN THE PROVIDER ---
    <NutritionProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="search" color={color} />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <Ionicons
                      name="search"
                      size={25}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="Log"
          options={{
            title: "Logged Foods",
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Goals"
          options={{
            title: "Goals",
            tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
          }}
        />
      </Tabs>
    </NutritionProvider>
  );
}
