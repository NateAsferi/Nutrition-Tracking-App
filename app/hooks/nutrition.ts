// nutrition.ts
import { searchFoods } from "@/api/searchFoods";
import { getMacros } from "@/api/getMacros";

export interface NutritionResult {
  fdcId: number;
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  servingSize: number | null;
}

export async function getNutritionForQuery(
  query: string
): Promise<NutritionResult[]> {
  const results = await searchFoods(query);
  if (results.length === 0) return [];

  // Take top 10 results
  const top10 = results.slice(0, 10);
  console.log(`Found ${results.length} results, processing top 10:`, top10);

  // Fetch macros for all top 10 foods in parallel
  const nutritionResults = await Promise.all(
    top10.map(async (food: { fdcId: number; name: string }) => {
      try {
        const macros = await getMacros(food.fdcId);
        return {
          fdcId: food.fdcId,
          name: macros.name,
          calories: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          servingSize: macros.servingSize,
        };
      } catch (error) {
        console.warn(`Failed to get macros for food ${food.fdcId}:`, error);
        // Return basic info if macros fetch fails
        return {
          fdcId: food.fdcId,
          name: food.name,
          calories: null,
          protein: null,
          carbs: null,
          fat: null,
          servingSize: null,
        };
      }
    })
  );

  console.log("Nutrition results:", nutritionResults);
  return nutritionResults;
}
