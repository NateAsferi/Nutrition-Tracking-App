import { apiRequest } from "@/util/api";

export async function getMacros(fdcId: number) {
  const data = await apiRequest(`food/${fdcId}`);

  const nutrients = data.foodNutrients || [];

  const IDS = {
    calories: [1008],
    protein: [1003],
    carbs: [1005],
    fat: [1004],
  };

  const NAMES = {
    calories: ["Energy"],
    protein: ["Protein"],
    carbs: ["Carbohydrate, by difference"],
    fat: ["Total lipid (fat)"],
  };

  function getMacro(ids: number[], names: string[]) {
    const byId = nutrients.find(
      (n: any) => n.nutrient && ids.includes(n.nutrient.id)
    );
    if (byId) return byId.amount ?? null;

    const byName = nutrients.find(
      (n: any) => n.nutrient && names.includes(n.nutrient.name)
    );
    return byName ? byName.amount ?? null : null;
  }

  return {
    fdcId,
    name: data.description,

    // macros
    calories: getMacro(IDS.calories, NAMES.calories),
    protein: getMacro(IDS.protein, NAMES.protein),
    carbs: getMacro(IDS.carbs, NAMES.carbs),
    fat: getMacro(IDS.fat, NAMES.fat),
    servingSize: data.servingSize,
  };
}
