import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import Colors from "@/constants/Colors";
import { Text, View } from "./Themed";

// NEW unified USDA hook
import { getNutritionForQuery, NutritionResult } from "@/app/hooks/nutrition";

export default function MealSearchScreen() {
  const [foods, setFoods] = useState<NutritionResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchFood = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);
    setFoods([]);

    try {
      const results = await getNutritionForQuery(searchQuery);

      if (results.length === 0) {
        setError("No foods found.");
        return;
      }

      setFoods(results);
    } catch (err) {
      console.error("Error searching:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods (e.g., tuna, apple, pasta)"
          placeholderTextColor={Colors.light.tabIconDefault}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchFood}
        />
        <View style={styles.buttonContainer}>
          <Button title="Search" onPress={searchFood} disabled={loading} />
        </View>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Results */}
      {!loading && foods.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultsHeader}>
            Found {foods.length} food{foods.length !== 1 ? "s" : ""}
          </Text>

          {foods.map((food) => (
            <View key={food.fdcId} style={styles.foodCard}>
              <View style={styles.foodHeader}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.servingSize}>{food.servingSize} g</Text>
              </View>
              <View style={styles.macrosContainer}>
                {food.calories !== null && (
                  <Macro
                    label="Calories"
                    value={`${food.calories.toFixed(0)} kcal`}
                  />
                )}
                {food.protein !== null && (
                  <Macro
                    label="Protein"
                    value={`${food.protein.toFixed(1)} g`}
                  />
                )}
                {food.carbs !== null && (
                  <Macro label="Carbs" value={`${food.carbs.toFixed(1)} g`} />
                )}
                {food.fat !== null && (
                  <Macro label="Fat" value={`${food.fat.toFixed(1)} g`} />
                )}
                {food.calories === null &&
                  food.protein === null &&
                  food.carbs === null &&
                  food.fat === null && (
                    <Text style={styles.noMacrosText}>
                      Nutritional information not available
                    </Text>
                  )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// Small reusable macro component
function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroItem}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.light.background,
  },
  buttonContainer: {
    marginTop: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  errorContainer: {
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#c00",
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.light.tint,
  },
  foodCard: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  servingSize: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 12,
  },
  macrosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  macroItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.light.tabIconDefault + "15",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noMacrosText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontStyle: "italic",
    width: "100%",
    textAlign: "center",
    padding: 8,
  },
});
