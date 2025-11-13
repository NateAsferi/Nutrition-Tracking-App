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

export const LoggedFoods = () => {
  const { loggedFoods, totals, deleteFoodFromLog } = useNutrition();

  const handleDelete = (logId: string) => {
    deleteFoodFromLog(logId);
  };

  if (loggedFoods.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No foods logged yet.</Text>
        <Text style={styles.emptySubtext}>
          Search and add foods to track your nutrition!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Daily Totals Header */}
      <View style={styles.totalsContainer}>
        <Text style={styles.totalsHeader}>Daily Totals</Text>
        <View style={styles.totalsGrid}>
          <TotalItem
            label="Calories"
            value={`${totals.totalCalories.toFixed(0)}`}
          />
          <TotalItem
            label="Protein"
            value={`${totals.totalProtein.toFixed(1)}g`}
          />
          <TotalItem label="Carbs" value={`${totals.totalCarbs.toFixed(1)}g`} />
          <TotalItem label="Fat" value={`${totals.totalFat.toFixed(1)}g`} />
        </View>
      </View>

      {/* Logged Foods List */}
      <View style={styles.foodsHeader}>
        <Text style={styles.foodsHeaderText}>
          Logged Foods ({loggedFoods.length})
        </Text>
      </View>

      <FlatList
        data={loggedFoods}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            <View style={styles.foodContent}>
              <Text style={styles.foodName}>{item.name}</Text>
              <View style={styles.macrosContainer}>
                <Macro label="Calories" value={`${item.calories.toFixed(0)}`} />
                <Macro label="Protein" value={`${item.protein.toFixed(1)}g`} />
                <Macro label="Carbs" value={`${item.carbs.toFixed(1)}g`} />
                <Macro label="Fat" value={`${item.fat.toFixed(1)}g`} />
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
function TotalItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.totalItem}>
      <Text style={styles.totalLabel}>{label}</Text>
      <Text style={styles.totalValue}>{value}</Text>
    </View>
  );
}

// Macro component (reused from FoodSearch)
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
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
  },
  totalsContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  totalsHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.tint,
    marginBottom: 12,
  },
  totalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  totalItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.light.tabIconDefault + "15",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  foodsHeader: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  foodsHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  list: {
    flex: 1,
  },
  foodItem: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault + "30",
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
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
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
