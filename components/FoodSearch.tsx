import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getNutritionForQuery, NutritionResult } from "@/app/hooks/nutrition";
import Colors from "@/constants/Colors";
import { useNutrition } from "../context/NutritionContext";
import { Food } from "../types/nutrition";

export const FoodSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NutritionResult[]>([]);
  const [suggestions, setSuggestions] = useState<NutritionResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addFoodToLog } = useNutrition();

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setError(null);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (!text.trim()) {
      setResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(false);
      return;
    }
    
    if (text.trim().length >= 2) {
      setShowSuggestions(true);
      setLoadingSuggestions(true);
      
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const nutritionResults = await getNutritionForQuery(text.trim());
          setSuggestions(nutritionResults.slice(0, 5));
        } catch (err) {
          console.error("Error getting suggestions:", err);
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 400);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setLoadingSuggestions(false);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    if (query.trim().length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }

    setShowSuggestions(false);
    setHasSearched(true);
    
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

  const handleSelectSuggestion = (suggestion: NutritionResult) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setResults([suggestion]);
  };

  const handleAddFood = (nutritionResult: NutritionResult) => {
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
      setError(null);
    } else {
      setError("Nutritional information incomplete. Cannot add to log.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
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

        {showSuggestions && query.trim().length >= 2 && !hasSearched && !loading && (
          <View style={styles.suggestionsContainer}>
          {loadingSuggestions ? (
            <View style={styles.suggestionLoadingContainer}>
              <ActivityIndicator size="small" color={Colors.light.tint} />
              <Text style={styles.suggestionLoadingText}>Searching...</Text>
            </View>
          ) : suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  {item.calories !== null && (
                    <Text style={styles.suggestionCalories}>
                      {item.calories.toFixed(0)} cal
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.fdcId.toString()}
              style={styles.suggestionsList}
              nestedScrollEnabled={true}
            />
          ) : (
            <View style={styles.noSuggestionsContainer}>
              <Text style={styles.noSuggestionsText}>No suggestions found</Text>
            </View>
          )}
          </View>
        )}
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
  searchWrapper: {
    position: "relative",
    zIndex: 1,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  suggestionsContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault + "40",
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault + "20",
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  suggestionCalories: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 8,
  },
  suggestionLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  suggestionLoadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  noSuggestionsContainer: {
    padding: 12,
    alignItems: "center",
  },
  noSuggestionsText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontStyle: "italic",
  },
});
