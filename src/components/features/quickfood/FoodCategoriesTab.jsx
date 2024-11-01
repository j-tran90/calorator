import React, { useState } from "react";
import { Tabs, Tab, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FoodCategory from "./FoodCategory";
import { fruits } from "./data/fruitsData";
import { vegetables } from "./data/vegetablesData";
import { meats } from "./data/meatsData";
import { dairy } from "./data/dairyData";
import { grains } from "./data/grainsData";
import { beverages } from "./data/beveragesData";
import { sweets } from "./data/sweetsData";
import { popularFoods } from "./data/popularData";

function FoodCategoriesTabs({ updateTotal, sumEntry }) {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Define categories with data
  const categories = [
    { label: "Popular", items: popularFoods },
    { label: "Fruits", items: fruits },
    { label: "Vegetables", items: vegetables },
    { label: "Meat", items: meats },
    { label: "Dairy", items: dairy },
    { label: "Grains", items: grains },
    { label: "Beverages", items: beverages },
    { label: "Sweets & Sugar", items: sweets },
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
          <Tab key={index} label={category.label} />
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
            <FoodCategory
              items={category.items}
              sumEntry={sumEntry}
              updateTotal={updateTotal}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

export default FoodCategoriesTabs;
