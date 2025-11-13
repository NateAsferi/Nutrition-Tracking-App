import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Button,
} from "react-native";

import Colors from "@/constants/Colors";
import { useNutrition } from "../context/NutritionContext";
import { getNutritionForQuery, NutritionResult } from "@/app/hooks/nutrition";
import { Food } from "../types/nutrition";

export const FoodSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NutritionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addFoodToLog } = useNutrition();

  // Handle text input - only update query state, don't search
  const handleQueryChange = (text: string) => {
    setQuery(text);
    setError(null);
    // Clear results when user starts typing
    if (!text.trim()) {
      setResults([]);
    }
  };

  // Perform search when button is pressed or Enter is pressed
  const performSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    if (query.trim().length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nutritionResults = await getNutritionForQuery(query.trim());
      setResults(nutritionResults);
      if (nutritionResults.length === 0) {
        setError("No foods found.");
      }
    } catch (err) {
      console.error("Error searching:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (nutritionResult: NutritionResult) => {
    // Convert NutritionResult to Food format
    // Only add if we have valid nutrition data
    if (
      nutritionResult.calories !== null &&
      nutritionResult.protein !== null &&
      nutritionResult.carbs !== null &&
      nutritionResult.fat !== null
    ) {
      const food: Food = {
        id: nutritionResult.fdcId.toString(),
        name: nutritionResult.name,
        calories: nutritionResult.calories,
        protein: nutritionResult.protein,
        carbs: nutritionResult.carbs,
        fat: nutritionResult.fat,
      };
      addFoodToLog(food);
      // Show success feedback (optional - you can add a toast notification here)
      setError(null);
    } else {
      setError("Nutritional information incomplete. Cannot add to log.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Search for a food..."
          placeholderTextColor={Colors.light.tabIconDefault}
          value={query}
          onChangeText={handleQueryChange}
          onSubmitEditing={performSearch}
          returnKeyType="search"
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Search"
            onPress={performSearch}
            disabled={loading || !query.trim()}
          />
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && results.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsHeaderText}>
            Found {results.length} food{results.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <View style={styles.foodHeader}>
              <Text style={styles.resultText}>{item.name}</Text>
              <View style={styles.headerRight}>
                {item.servingSize !== null && (
                  <Text style={styles.servingSize}>{item.servingSize}g</Text>
                )}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddFood(item)}
                >
                  <Text style={styles.addButtonText}>Add +</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.macrosContainer}>
              {item.calories !== null && (
                <Macro label="Calories" value={`${item.calories.toFixed(0)}`} />
              )}
              {item.protein !== null && (
                <Macro label="Protein" value={`${item.protein.toFixed(1)}g`} />
              )}
              {item.carbs !== null && (
                <Macro label="Carbs" value={`${item.carbs.toFixed(1)}g`} />
              )}
              {item.fat !== null && (
                <Macro label="Fat" value={`${item.fat.toFixed(1)}g`} />
              )}
              {item.calories === null &&
                item.protein === null &&
                item.carbs === null &&
                item.fat === null && (
                  <Text style={styles.noMacrosText}>
                    Nutritional info unavailable
                  </Text>
                )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.fdcId.toString()}
        style={styles.list}
      />
    </View>
  );
};

// Small reusable macro component
function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroItem}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: Colors.light.tabIconDefault,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  buttonContainer: {
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  errorContainer: {
    backgroundColor: "#fee",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: "#c00",
    fontSize: 12,
  },
  resultsHeader: {
    marginBottom: 8,
  },
  resultsHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.tint,
  },
  list: {
    flex: 1,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault + "30",
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  servingSize: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  macrosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  macroItem: {
    backgroundColor: Colors.light.tabIconDefault + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 50,
    alignItems: "center",
    marginRight: 6,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 10,
    color: Colors.light.tabIconDefault,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  noMacrosText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontStyle: "italic",
  },
});
