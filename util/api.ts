export async function apiRequest(
  endpoint: string,
  params: Record<string, string | number> = {}
) {
  const apiKey = process.env.EXPO_PUBLIC_USDA_API_KEY!;
  const url = `https://api.nal.usda.gov/fdc/v1/${endpoint}?${new URLSearchParams({
    api_key: apiKey,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  }).toString()}`;

  console.log("USDA URL:", url);

  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown USDA error");
    throw new Error(`USDA error ${res.status} – ${errorText}`);
  }

  return res.json();
}
