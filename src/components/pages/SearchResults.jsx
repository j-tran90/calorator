import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import AddToJournalButton from "../AddToJournalButton"; // Import the button component
import SearchBar from "../features/search/SearchBar";

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

          return {
            name: food.description,
            energy: energyNutrient ? `${energyNutrient.value} kcal` : "N/A",
            protein: proteinNutrient ? `${proteinNutrient.value} g` : "N/A",
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

  return (
    <>
      <SearchBar />
      <TableContainer
        component={Paper}
        sx={{ maxWidth: 600, margin: "0 auto", mt: 3 }}
      >
        {loading ? ( // Conditionally render loading circle
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Food Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Calories (kcal)</strong>
                </TableCell>
                <TableCell>
                  <strong>Protein (g)</strong>
                </TableCell>
                <TableCell>
                  <strong>Add to Journal</strong>
                </TableCell>
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
                    <TableCell>
                      <AddToJournalButton
                        calories={parseFloat(item.energy)}
                        food={item.name}
                      />{" "}
                      {/* Pass food name */}
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
