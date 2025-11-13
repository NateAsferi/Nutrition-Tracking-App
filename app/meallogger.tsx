// app/mealLogger.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ListRenderItem,
  ScrollView,
} from 'react-native';
import { useMeals } from './mealProvider';
import type { Meal } from './mealProvider';

export default function MealLogger() {
  const { meals, addMeal } = useMeals();

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleAddMeal = () => {
    if (!mealName.trim()) return;

    addMeal({
      name: mealName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });

    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const renderMeal: ListRenderItem<Meal> = ({ item }) => (
    <View style={styles.mealItem}>
      <Text style={styles.mealText}>{item.name}</Text>
      <Text style={styles.nutrition}>
        {item.calories} kcal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
      </Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🥗 Nutrition Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Meal name"
        value={mealName}
        onChangeText={setMealName}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs (g)"
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />
      <TextInput
        style={styles.input}
        placeholder="Fat (g)"
        keyboardType="numeric"
        value={fat}
        onChangeText={setFat}
      />

      <Button title="Add Meal" onPress={handleAddMeal} />

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMeal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  mealItem: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  mealText: {
    fontSize: 18,
    fontWeight: '500',
  },
  nutrition: {
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

