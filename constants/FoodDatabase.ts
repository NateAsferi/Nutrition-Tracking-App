import { Food } from '../types/nutrition';

// This is your mock database.
// Your searchFood() function will get its data from this list.
export const MOCK_FOODS: Food[] = [
  // Fruits
  { id: '1', name: 'Apple, medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: '2', name: 'Banana, medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: '3', name: 'Orange, medium', calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { id: '4', name: 'Strawberries (1 cup)', calories: 49, protein: 1, carbs: 12, fat: 0.5 },
  
  // Grains
  { id: '5', name: 'Bread (1 slice)', calories: 79, protein: 3.6, carbs: 14, fat: 1.1 },
  { id: '6', name: 'White Rice (1 cup cooked)', calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
  { id: '7', name: 'Oatmeal (1 cup cooked)', calories: 158, protein: 5.5, carbs: 27, fat: 3.2 },
  { id: '8', name: 'Pasta (1 cup cooked)', calories: 220, protein: 8, carbs: 43, fat: 1.3 },

  // Protein
  { id: '9', name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: '10', name: 'Egg (large)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { id: '11', name: 'Ground Beef 90% (100g)', calories: 199, protein: 28, carbs: 0, fat: 9.3 },
  { id: '12', name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: '13', name: 'Tofu, firm (100g)', calories: 76, protein: 8, carbs: 3, fat: 5 },

  // Dairy
  { id: '14', name: 'Milk, 2% (1 cup)', calories: 122, protein: 8, carbs: 12, fat: 4.8 },
  { id: '15', name: 'Cheddar Cheese (1 oz)', calories: 115, protein: 7, carbs: 0.1, fat: 9.6 },
  { id: '16', name: 'Greek Yogurt, plain (1 cup)', calories: 100, protein: 17, carbs: 6, fat: 0.7 },

  // Vegetables
  { id: '17', name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: '18', name: 'Carrot, medium', calories: 25, protein: 0.6, carbs: 6, fat: 0.1 },
  { id: '19', name: 'Spinach (1 cup)', calories: 7, protein: 0.9, carbs: 1, fat: 0.1 },
  { id: '20', name: 'Potato, medium', calories: 163, protein: 4.3, carbs: 37, fat: 0.2 },
];