import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import Colors from "@/constants/Colors";
import { useNutrition } from "../context/NutritionContext";
import { LoggedFood } from "../context/NutritionContext";
import { useColorScheme } from "./useColorScheme";

export const LoggedFoods = () => {
  const { loggedFoods, totals, deleteFoodFromLog } = useNutrition();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleDelete = (logId: string) => {
    deleteFoodFromLog(logId);
  };

  if (loggedFoods.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>No foods logged yet.</Text>
        <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
          Search and add foods to track your nutrition!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Daily Totals Header */}
      <View style={[
        styles.totalsContainer,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}>
        <Text style={[styles.totalsHeader, { color: colors.tint }]}>Daily Totals</Text>
        <View style={styles.totalsGrid}>
          <TotalItem
            label="Calories"
            value={`${totals.totalCalories.toFixed(0)}`}
            colors={colors}
          />
          <TotalItem
            label="Protein"
            value={`${totals.totalProtein.toFixed(1)}g`}
            colors={colors}
          />
          <TotalItem label="Carbs" value={`${totals.totalCarbs.toFixed(1)}g`} colors={colors} />
          <TotalItem label="Fat" value={`${totals.totalFat.toFixed(1)}g`} colors={colors} />
        </View>
      </View>

      {/* Logged Foods List */}
      <View style={styles.foodsHeader}>
        <Text style={[styles.foodsHeaderText, { color: colors.text }]}>
          Logged Foods ({loggedFoods.length})
        </Text>
      </View>

      <FlatList
        data={loggedFoods}
        renderItem={({ item }) => (
          <View style={[
            styles.foodItem,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border + '50',
            },
          ]}>
            <View style={styles.foodContent}>
              <Text style={[styles.foodName, { color: colors.text }]}>{item.name}</Text>
              <View style={styles.macrosContainer}>
                <Macro label="Calories" value={`${item.calories.toFixed(0)}`} colors={colors} />
                <Macro label="Protein" value={`${item.protein.toFixed(1)}g`} colors={colors} />
                <Macro label="Carbs" value={`${item.carbs.toFixed(1)}g`} colors={colors} />
                <Macro label="Fat" value={`${item.fat.toFixed(1)}g`} colors={colors} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.logId)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.logId}
        style={styles.list}
      />
    </View>
  );
};

// Total item component for daily totals
function TotalItem({ label, value, colors }: { label: string; value: string; colors: typeof Colors.light }) {
  return (
    <View style={[styles.totalItem, { backgroundColor: colors.border + '25' }]}>
      <Text style={[styles.totalLabel, { color: colors.secondaryText }]}>{label}</Text>
      <Text style={[styles.totalValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

// Macro component (reused from FoodSearch)
function Macro({ label, value, colors }: { label: string; value: string; colors: typeof Colors.light }) {
  return (
    <View style={[styles.macroItem, { backgroundColor: colors.border + '25' }]}>
      <Text style={[styles.macroLabel, { color: colors.secondaryText }]}>{label}</Text>
      <Text style={[styles.macroValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  totalsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  totalsHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  totalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  totalItem: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodsHeader: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  foodsHeaderText: {
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  foodItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
    marginHorizontal: 16,
  },
  foodContent: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  macroItem: {
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
    textTransform: "uppercase",
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
  },
});
