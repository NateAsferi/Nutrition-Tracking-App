import Colors from "@/constants/Colors";
import React, { useState } from "react";
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNutrition } from "../context/NutritionContext";
import { useColorScheme } from "./useColorScheme";

export const Goals = () => {
  const { goals, totals, updateGoals } = useNutrition();
  const [editing, setEditing] = useState(false);
  const [inputs, setInputs] = useState(goals);
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const handleEdit = () => {
    setInputs(goals);
    setEditing(true);
  };

  const handleSave = () => {
    updateGoals(inputs);
    setEditing(false);
  };

  const handleChange = (field: keyof typeof inputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Number(value.replace(/[^0-9]/g, "")) || 0,
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.cardBackground,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.tint }]}>
          Your Daily Goals
        </Text>
        <View style={styles.goalsContainer}>
          <GoalRow
            label="Calories"
            value={editing ? String(inputs.calories) : String(goals.calories)}
            suffix="kcal"
            editable={editing}
            onChangeText={(val) => handleChange("calories", val)}
            colors={colors}
            current={totals.totalCalories}
            goal={goals.calories}
            editing={editing}
          />
          <GoalRow
            label="Protein"
            value={editing ? String(inputs.protein) : String(goals.protein)}
            suffix="g"
            editable={editing}
            onChangeText={(val) => handleChange("protein", val)}
            colors={colors}
            current={totals.totalProtein}
            goal={goals.protein}
            editing={editing}
          />
          <GoalRow
            label="Fat"
            value={editing ? String(inputs.fat) : String(goals.fat)}
            suffix="g"
            editable={editing}
            onChangeText={(val) => handleChange("fat", val)}
            colors={colors}
            current={totals.totalFat}
            goal={goals.fat}
            editing={editing}
          />
          <GoalRow
            label="Carbs"
            value={editing ? String(inputs.carbs) : String(goals.carbs)}
            suffix="g"
            editable={editing}
            onChangeText={(val) => handleChange("carbs", val)}
            colors={colors}
            current={totals.totalCarbs}
            goal={goals.carbs}
            editing={editing}
          />
        </View>
        <View style={{ marginTop: 24 }}>
          {editing ? (
            <Button title="Save Goals" onPress={handleSave} />
          ) : (
            <Button title="Edit Goals" onPress={handleEdit} />
          )}
        </View>
        <Text style={[styles.motivation, { color: colors.tint }]}>
          {editing
            ? "Set realistic & uplifting goals!"
            : "Keep going! Every step counts 💪"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

type RowProps = {
  label: string;
  value: string;
  suffix: string;
  editable: boolean;
  onChangeText: (val: string) => void;
  colors: typeof Colors.light;
  current: number;
  goal: number;
  editing: boolean;
};

const GoalRow = ({
  label,
  value,
  suffix,
  editable,
  onChangeText,
  colors,
  current,
  goal,
  editing,
}: RowProps) => {
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const isOverGoal = current > goal;

  return (
    <View style={styles.rowContainer}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>{label}:</Text>
        {editable ? (
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
              },
            ]}
            value={value}
            onChangeText={onChangeText}
            keyboardType="numeric"
            placeholderTextColor={colors.secondaryText}
          />
        ) : (
          <Text
            style={[
              styles.value,
              { color: colors.text, backgroundColor: colors.inputBackground },
            ]}
          >
            {value}
          </Text>
        )}
        <Text style={[styles.suffix, { color: colors.secondaryText }]}>
          {suffix}
        </Text>
      </View>
      {!editing && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBarBackground,
              { backgroundColor: colors.border + "30" },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: isOverGoal
                    ? "#ff6b6b"
                    : progress >= 90
                    ? "#51cf66"
                    : colors.tint,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.secondaryText }]}>
            {current.toFixed(label === "Calories" ? 0 : 1)} {suffix} / {goal}{" "}
            {suffix} ({progress.toFixed(0)}%)
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    padding: 50,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  goalsContainer: {
    width: "100%",
    marginBottom: 8,
    marginRight: 70,
  },
  rowContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    marginTop: 2,
  },
  label: {
    fontSize: 17,
    flex: 1,
    fontWeight: "600",
    minWidth: 100,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    padding: 8,
    width: 70,
    marginRight: 1,
    borderRadius: 5,
  },
  value: {
    fontSize: 16,
    width: 70,
    marginRight: 1,
    textAlign: "right",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  suffix: {
    fontSize: 16,
    minWidth: 40,
  },
  motivation: {
    fontSize: 16,
    marginTop: 24,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Goals;
