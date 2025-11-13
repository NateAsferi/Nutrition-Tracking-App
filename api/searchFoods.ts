// searchFoods.ts
import { apiRequest } from "@/util/api";

export async function searchFoods(query: string) {
  if (!query || query.trim().length === 0) return [];

  const data = await apiRequest("foods/search", {
    query,
    pageSize: 25,
    requireAllWords: "true",
    dataType: "Branded,Foundation,Survey (FNDDS)",
  });

  // Clean results so your RN UI doesn't choke
  return data.foods.map((f: any) => ({
    fdcId: f.fdcId,
    name: f.description,
    brand: f.brandOwner ?? null,
    dataType: f.dataType,
    score: f.score,
  }));
}
