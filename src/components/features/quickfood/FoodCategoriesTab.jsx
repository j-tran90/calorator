import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function FoodCategoriesTabs() {
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
        centered={!isMobile}
        sx={{
          "& .MuiTabs-scroller": {
            overflowX: isMobile ? "auto" : "hidden",
            maxWidth: isMobile ? "100%" : "100%",
          },
          "& .MuiTabs-flexContainer": {
            width: isMobile ? "calc(100% + 100px)" : "100%", // Create overflow to reveal more tabs
          },
          maxWidth: isMobile ? "75vw" : "100%", // Limit width to show only first 3 tabs on mobile
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
            <Typography variant='h6'>{`Content for ${category}`}</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default FoodCategoriesTabs;
