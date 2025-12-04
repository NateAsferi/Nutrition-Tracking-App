import { createContext, useContext, useState } from "react";
import { calculateDailyTotals } from "../services/NutritionService";
import { DailyTotals, Food, Goals } from "../types/nutrition";

export interface LoggedFood extends Food {
  logId: string;
}

const defaultGoals: Goals = {
  calories: 2000,
  protein: 150,
  fat: 70,
  carbs: 250,
};

interface NutritionContextType {
  loggedFoods: LoggedFood[];
  totals: DailyTotals;
  goals: Goals;
  addFoodToLog: (food: Food) => void;
  deleteFoodFromLog: (logId: string) => void;
  updateGoals: (goals: Goals) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(
  undefined
);
export const NutritionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [goals, setGoals] = useState<Goals>(defaultGoals);

  const addFoodToLog = (food: Food) => {
    const newLoggedFood: LoggedFood = {
      ...food,
      logId: Date.now().toString(),
    };
    setLoggedFoods((prevFoods) => [...prevFoods, newLoggedFood]);
  };

  const deleteFoodFromLog = (logId: string) => {
    setLoggedFoods((prevFoods) =>
      prevFoods.filter((food) => food.logId !== logId)
    );
  };

  const updateGoals = (newGoals: Goals) => {
    setGoals(newGoals);
  };

  const totals = calculateDailyTotals(loggedFoods);

  return (
    <NutritionContext.Provider
      value={{
        loggedFoods,
        totals,
        goals,
        addFoodToLog,
        deleteFoodFromLog,
        updateGoals,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error("useNutrition must be used within a NutritionProvider");
  }
  return context;
};
