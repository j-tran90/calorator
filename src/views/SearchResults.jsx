// SearchResults.jsx

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

const SearchResults = () => {
  const location = useLocation();
  const { query } = location.state;
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchFoodData = async () => {
      const apiKey = import.meta.env.VITE_FOOD_API_KEY;
      try {
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=${rowsPerPage}&pageNumber=${
            page + 1
          }&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setResults(data.foods || []);
        setTotalResults(data.totalHits || 0);
      } catch (err) {
        setError("Failed to fetch food data. Please try again later.");
      }
    };

    fetchFoodData();
  }, [query, page, rowsPerPage]);

  const getNutrientValue = (nutrients, nutrientNames) => {
    if (!Array.isArray(nutrients)) return "N/A";
    const nutrient = nutrients.find((n) =>
      nutrientNames.includes(n.nutrientName)
    );
    // Here, if we find the nutrient, we return its value along with the unit
    return nutrient && nutrient.value
      ? `${nutrient.value} ${nutrient.unitName}`
      : "N/A";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h1>Results for "{query}"</h1>
      {error && <p>{error}</p>}
      {!error && (
        <>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 800, margin: "0 auto", mt: 3 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Food Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Calories</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Protein (g)</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((food) => (
                  <TableRow key={food.fdcId}>
                    <TableCell>{food.description}</TableCell>
                    <TableCell>
                      {getNutrientValue(food.nutrients, ["Energy"])}
                    </TableCell>
                    <TableCell>
                      {getNutrientValue(food.nutrients, ["Protein"])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component='div'
            count={totalResults}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default SearchResults;
