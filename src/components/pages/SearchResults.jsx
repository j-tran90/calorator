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
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
} from "@mui/material";
import Header from "../navigation/Header";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = location.state?.query;
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track quantity for each row by index
  const [quantities, setQuantities] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(null);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleQuantityChange = (index, value) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: Math.max(1, Number(value)),
    }));
  };

  const handleIncrement = (index) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: (prev[index] || 1) + 1,
    }));
  };

  const handleDecrement = (index) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: Math.max(1, (prev[index] || 1) - 1),
    }));
  };

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchFoodData = async () => {
      const apiKey = import.meta.env.VITE_FOOD_API_KEY;

      if (!searchQuery) return;

      setLoading(true);

      try {
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchQuery}&pageSize=25&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

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
          .filter((item) => item !== null);

        setFoodData(formattedData);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [searchQuery]);

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
                {!isMobile && <TableCell>Calories (kcal)</TableCell>}
                {!isMobile && <TableCell>Protein (g)</TableCell>}
                {!isMobile && (
                  <TableCell
                    sx={{ display: { xxs: "none", sm: "table-cell" } }}
                  >
                    Sugar (g)
                  </TableCell>
                )}
                {!isMobile && (
                  <TableCell
                    sx={{ display: { xxs: "none", sm: "table-cell" } }}
                  >
                    Carbs (g)
                  </TableCell>
                )}
                {!isMobile && (
                  <TableCell
                    sx={{ display: { xxs: "none", sm: "table-cell" } }}
                  >
                    Fats (g)
                  </TableCell>
                )}
                <TableCell align='center'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foodData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 2 : 7} align='center'>
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                foodData.map((item, index) => {
                  // Parse values for calculation, fallback to 0 if N/A
                  const calories = parseFloat(item.energy) || 0;
                  const protein = parseFloat(item.protein) || 0;
                  const sugar = parseFloat(item.sugar) || 0;
                  const carbs = parseFloat(item.carbs) || 0;
                  const fats = parseFloat(item.totalLipids) || 0;
                  const quantity = quantities[index] || 1;

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography>{item.name}</Typography>
                          {isMobile && (
                            <IconButton
                              size='small'
                              onClick={() => handleExpand(index)}
                              aria-label='expand'
                            >
                              <ExpandMoreIcon
                                sx={{
                                  transform:
                                    expandedIndex === index
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.2s",
                                }}
                              />
                            </IconButton>
                          )}
                        </Box>
                        {isMobile && expandedIndex === index && (
                          <Accordion
                            expanded={true}
                            onChange={() => handleExpand(index)}
                            sx={{ boxShadow: "none", mt: 1, mb: 0 }}
                          >
                            <AccordionSummary
                              expandIcon={null}
                              aria-controls={`panel${index}-content`}
                              id={`panel${index}-header`}
                              sx={{ display: "none" }}
                            />
                            <AccordionDetails sx={{ p: 1 }}>
                              <Typography variant='body2'>
                                <strong>Calories:</strong> {item.energy}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Protein:</strong> {item.protein}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Sugar:</strong> {item.sugar}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Carbs:</strong> {item.carbs}
                              </Typography>
                              <Typography variant='body2'>
                                <strong>Fats:</strong> {item.totalLipids}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </TableCell>
                      {!isMobile && <TableCell>{item.energy}</TableCell>}
                      {!isMobile && <TableCell>{item.protein}</TableCell>}
                      {!isMobile && (
                        <TableCell
                          sx={{ display: { xxs: "none", sm: "table-cell" } }}
                        >
                          {item.sugar}
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell
                          sx={{ display: { xxs: "none", sm: "table-cell" } }}
                        >
                          {item.carbs}
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell
                          sx={{ display: { xxs: "none", sm: "table-cell" } }}
                        >
                          {item.totalLipids}
                        </TableCell>
                      )}
                      <TableCell align='center'>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size='small'
                            onClick={() => handleDecrement(index)}
                            aria-label='decrement'
                            sx={{ "& svg": { fontSize: "1.8rem" } }} // 20% bigger
                          >
                            <ArrowLeftIcon />
                          </IconButton>
                          <TextField
                            type='number'
                            size='small'
                            value={quantity}
                            variant='standard'
                            InputProps={{
                              disableUnderline: true,
                            }}
                            inputProps={{
                              min: 1,
                              max: 99, // <-- Limit to 99
                              style: {
                                textAlign: "center",
                                width: 32,
                                border: "none",
                                background: "none",
                                padding: 0,
                                margin: 0,
                                height: "100%",
                              },
                            }}
                            onChange={(e) => {
                              let val = Math.max(
                                1,
                                Math.min(99, Number(e.target.value))
                              );
                              handleQuantityChange(index, val);
                            }}
                            sx={{
                              width: "32px",
                              "& .MuiInputBase-root:before": {
                                borderBottom: "none",
                              },
                              "& .MuiInputBase-root:after": {
                                borderBottom: "none",
                              },
                              "& .MuiInputBase-root:hover:not(.Mui-disabled):before":
                                { borderBottom: "none" },
                              background: "none",
                              "& input::-webkit-outer-spin-button": {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                              "& input::-webkit-inner-spin-button": {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                              "& input[type=number]": {
                                MozAppearance: "textfield",
                              },
                            }}
                          />
                          <IconButton
                            size='small'
                            onClick={() => handleIncrement(index)}
                            aria-label='increment'
                            sx={{ "& svg": { fontSize: "1.8rem" } }}
                          >
                            <ArrowRightIcon />
                          </IconButton>
                          <AddToJournalButton
                            food={item.name}
                            calories={calories * quantity}
                            protein={protein * quantity}
                            sugar={sugar * quantity}
                            carbs={carbs * quantity}
                            fats={fats * quantity}
                            onAdd={() => {
                              console.log("Added to journal:", item.name);
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
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
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
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
