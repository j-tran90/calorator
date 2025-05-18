import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import AddToJournalButton from "../../components/buttons/AddToJournalButton";
import { Box, Typography } from "@mui/material";
import Header from "../navigation/Header";

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = location.state?.query;
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodData = async () => {
      const apiKey = import.meta.env.VITE_FOOD_API_KEY;

      if (!searchQuery) return; // Skip fetch if no search query is provided

      setLoading(true);

      try {
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchQuery}&pageSize=25&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Log the raw API response to inspect the fields
        console.log("API Response:", data);

        // Use a Set to track unique food names
        const uniqueNames = new Set();

        const formattedData = data.foods
          .map((food) => {
            const energyNutrient = food.foodNutrients.find(
              (nutrient) =>
                nutrient.nutrientName === "Energy" ||
                nutrient.nutrientName === "Calories"
            );

            const proteinNutrient = food.foodNutrients.find(
              (nutrient) => nutrient.nutrientName === "Protein"
            );

            const sugarNutrient = food.foodNutrients.find(
              (nutrient) =>
                nutrient.nutrientName === "Sugars, total" ||
                nutrient.nutrientName === "Total Sugars"
            );

            const carbsNutrient = food.foodNutrients.find(
              (nutrient) =>
                nutrient.nutrientName === "Carbohydrate, by difference"
            );

            const totalLipidsNutrient = food.foodNutrients.find(
              (nutrient) => nutrient.nutrientName === "Total lipid (fat)"
            );

            // Clean up the food description
            const cleanedName = cleanFoodDescription(food.description);

            // Skip duplicates
            if (uniqueNames.has(cleanedName)) {
              return null;
            }
            uniqueNames.add(cleanedName);

            return {
              name: cleanedName,
              energy: energyNutrient ? `${energyNutrient.value} kcal` : "N/A",
              protein: proteinNutrient ? `${proteinNutrient.value} g` : "N/A",
              sugar: sugarNutrient ? `${sugarNutrient.value} g` : "N/A",
              carbs: carbsNutrient ? `${carbsNutrient.value} g` : "N/A",
              totalLipids: totalLipidsNutrient
                ? `${totalLipidsNutrient.value} g`
                : "N/A",
            };
          })
          .filter((item) => item !== null); // Remove null values from the array

        setFoodData(formattedData); // Set the food data
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchFoodData();
  }, [searchQuery]); // Fetch whenever searchQuery changes

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{ m: 2, height: "50px" }}
      >
        <Header headText={`Searched for: ${capitalizeWords(searchQuery)}`} />
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: "20px" }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#9998" }}>
                <TableCell>Food Name</TableCell>
                <TableCell>Calories (kcal)</TableCell>
                <TableCell>Protein (g)</TableCell>
                <TableCell sx={{ display: { xxs: "none", sm: "table-cell" } }}>
                  Sugar (g)
                </TableCell>
                <TableCell sx={{ display: { xxs: "none", sm: "table-cell" } }}>
                  Carbs (g)
                </TableCell>
                <TableCell sx={{ display: { xxs: "none", sm: "table-cell" } }}>
                  Fats (g)
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foodData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                foodData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.energy}</TableCell>
                    <TableCell>{item.protein}</TableCell>
                    <TableCell
                      sx={{ display: { xxs: "none", sm: "table-cell" } }}
                    >
                      {item.sugar}
                    </TableCell>
                    <TableCell
                      sx={{ display: { xxs: "none", sm: "table-cell" } }}
                    >
                      {item.carbs}
                    </TableCell>
                    <TableCell
                      sx={{ display: { xxs: "none", sm: "table-cell" } }}
                    >
                      {item.totalLipids}
                    </TableCell>
                    <TableCell>
                      <AddToJournalButton
                        food={item.name}
                        calories={parseFloat(item.energy)}
                        protein={parseFloat(item.protein)}
                        sugar={parseFloat(item.sugar)}
                        carbs={parseFloat(item.carbs)}
                        fats={parseFloat(item.totalLipids)}
                        onAdd={() => {
                          console.log("Added to journal:", item.name);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};

// Function to clean up the food description
function cleanFoodDescription(description, keywordsToRemove = []) {
  let cleanedDescription = description;

  // Remove everything before the last comma
  if (cleanedDescription.includes(",")) {
    cleanedDescription = cleanedDescription
      .substring(cleanedDescription.lastIndexOf(",") + 1)
      .trim();
  }

  // Remove all occurrences of unwanted keywords
  keywordsToRemove.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    cleanedDescription = cleanedDescription.replace(regex, "").trim();
  });

  // Remove commas and extra spaces
  cleanedDescription = cleanedDescription
    .replace(/,/g, "") // Remove all commas
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();

  // Capitalize the first letter of each word
  cleanedDescription = cleanedDescription
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return cleanedDescription;
}

// Function to capitalize the first letter of each word
function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default SearchResults;
