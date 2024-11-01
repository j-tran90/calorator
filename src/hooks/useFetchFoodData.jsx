import { useState, useEffect } from "react";

const apiKey = import.meta.env.VITE_FOOD_API_KEY;

const useFetchFoodData = (query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodData = async () => {
      if (!query) return; // Skip fetch if no query

      setLoading(true);
      setError(null); // Reset error state

      try {
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=5&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const formattedData = result.foods.map((food) => {
          const energyNutrient = food.foodNutrients.find(
            (nutrient) =>
              nutrient.nutrientName === "Energy" ||
              nutrient.nutrientName === "Calories"
          );

          const proteinNutrient = food.foodNutrients.find(
            (nutrient) => nutrient.nutrientName === "Protein"
          );

          return {
            id: food.fdcId,
            name: food.description,
            kcal: energyNutrient ? energyNutrient.value : 0,
            protein: proteinNutrient ? proteinNutrient.value : 0,
          };
        });

        setData(formattedData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [query]);

  return { data, loading, error };
};

export default useFetchFoodData;
