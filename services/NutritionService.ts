import { MOCK_FOODS } from '../constants/FoodDatabase';
import { DailyTotals, Food } from '../types/nutrition';

export const searchFood = (query: string): Food[] => {
  const lowerCaseQuery = query.toLowerCase().trim();

  if (!lowerCaseQuery) {
    return [];
  }

  return MOCK_FOODS.filter(food =>
    food.name.toLowerCase().includes(lowerCaseQuery)
  );
};

export const calculateDailyTotals = (loggedFoods: Food[]): DailyTotals => {
  const totals = loggedFoods.reduce(
    (acc, food) => {
      acc.totalCalories += food.calories;
      acc.totalProtein += food.protein;
      acc.totalCarbs += food.carbs;
      acc.totalFat += food.fat;
      return acc;
    },
    {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    }
  );

  return totals;
};