import React, { useState } from "react";
import { Tabs, Tab, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Fruits from "./Fruits"; // Adjust the path based on your structure

function FoodCategoriesTabs({ apiKey, updateTotal }) {
  // Accept updateTotal as a prop
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const categories = [
    "Fruits",
    "Vegetables",
    "Meat",
    "Dairy",
    "Grains",
    "Beverages",
    "Sweets and Sugars",
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons='auto'
        allowScrollButtonsMobile
        sx={{
          "& .MuiTabs-scroller": {
            overflowX: isMobile ? "auto" : "hidden",
            maxWidth: isMobile ? "100%" : "100%",
          },
          "& .MuiTabs-flexContainer": {
            width: isMobile ? "calc(100% + 100px)" : "100%",
          },
          maxWidth: isMobile ? "75vw" : "100%",
        }}
      >
        {categories.map((category, index) => (
          <Tab key={index} label={category} />
        ))}
      </Tabs>

      {categories.map((category, index) => (
        <Box
          key={index}
          role='tabpanel'
          hidden={value !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          sx={{ p: 3 }}
        >
          {value === index && (
            <>
              {category === "Fruits" && <Fruits updateTotal={updateTotal} />}{" "}
              {/* Pass updateTotal to Fruits */}
              {/* Other category components can be added similarly */}
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default FoodCategoriesTabs;
