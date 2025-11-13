import { createContext, useContext, useState } from "react";
import { calculateDailyTotals } from "../services/NutritionService";
import { DailyTotals, Food } from "../types/nutrition";

export interface LoggedFood extends Food {
  logId: string;
}

interface NutritionContextType {
  loggedFoods: LoggedFood[];
  totals: DailyTotals;
  addFoodToLog: (food: Food) => void;
  deleteFoodFromLog: (logId: string) => void;
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

  const totals = calculateDailyTotals(loggedFoods);

  return (
    <NutritionContext.Provider
      value={{
        loggedFoods,
        totals,
        addFoodToLog,
        deleteFoodFromLog,
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
