// app/mealProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
};

type MealContextType = {
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id' | 'timestamp'>) => void;
};

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = (meal: Omit<Meal, 'id' | 'timestamp'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
    };
    setMeals((prev) => [newMeal, ...prev]);
  };

  return (
    <MealContext.Provider value={{ meals, addMeal }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMeals = (): MealContextType => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
};

