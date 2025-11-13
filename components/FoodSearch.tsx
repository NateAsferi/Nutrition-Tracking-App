import { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useNutrition } from '../context/NutritionContext';
import { searchFood } from '../services/NutritionService';
import { Food } from '../types/nutrition';

export const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const { addFoodToLog } = useNutrition();
  const handleSearch = (text: string) => {
    setQuery(text);
    setResults(searchFood(text)); 
  };

  const handleFoodPress = (food: Food) => {
    addFoodToLog(food); 
    setQuery('');
    setResults([]);
  };

  return (
    <View style={styles.container}>
      {}
      <TextInput
        style={styles.textInput}
        placeholder="Search for a food..."
        value={query}
        onChangeText={handleSearch}
      />

      {}
      <FlatList
        data={results} 
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleFoodPress(item)}
          >
            <Text style={styles.resultText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#ffffffff',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    color: '#ffffffff',
  },
});