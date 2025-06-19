export function formatNutritionValue(value, unit = "g") {
  return Number(value) === 0 ? "- -" : `${value}${unit}`;
}
