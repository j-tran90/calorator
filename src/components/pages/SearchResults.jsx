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
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchQuery}&pageSize=5&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const formattedData = data.foods.map((food) => {
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

          return {
            name: food.description,
            energy: energyNutrient ? `${energyNutrient.value} kcal` : "N/A",
            protein: proteinNutrient ? `${proteinNutrient.value} g` : "N/A",
            sugar: sugarNutrient ? `${sugarNutrient.value} g` : "N/A",
            carbs: carbsNutrient ? `${carbsNutrient.value} g` : "N/A",
            totalLipids: totalLipidsNutrient
              ? `${totalLipidsNutrient.value} g`
              : "N/A",
          };
        });

        setFoodData(formattedData); // Set the food data
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchFoodData();
  }, [searchQuery]); // Fetch whenever searchQuery changes

  function capitalizeWords(input) {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <>
      <Box sx={{ pb: 2, pl: 2 }}>
        <Header headText={`Searched for: ${capitalizeWords(searchQuery)}`} />
      </Box>
      <TableContainer component={Paper}>
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#9998" }}>
                <TableCell>Food Name</TableCell>
                <TableCell>Calories (kcal)</TableCell>
                <TableCell>Protein (g)</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Sugar (g)
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Carbs (g)
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
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
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      {item.sugar}
                    </TableCell>
                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      {item.carbs}
                    </TableCell>
                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      {item.totalLipids}
                    </TableCell>
                    <TableCell>
                      <AddToJournalButton
                        food={item.name}
                        calories={parseFloat(item.energy)}
                        protein={parseFloat(item.protein)}
                        // sugar={parseFloat(item.sugar)}
                        // carbs={parseFloat(item.carbs)}
                        // fats={parseFloat(item.totalLipids)}
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

export default SearchResults;
