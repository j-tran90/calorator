import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { popularFoods } from "./data/popularData"; // Adjust the import path as necessary
import AddToJournalButton from "./AddToJournalButton"; // Import your button component

const Popular = ({ updateTotal, sumEntry }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h2' gutterBottom>
        Popular Foods
      </Typography>
      <Grid container spacing={2}>
        {popularFoods.map((food) => (
          <Grid item xs={12} sm={6} md={4} key={food.id}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
              }}
            >
              {food.icon}
              <Typography variant='h6'>{food.name}</Typography>
              <Typography variant='body1'>{food.kcal} kcal</Typography>
              <AddToJournalButton
                food={food}
                updateTotal={updateTotal}
                sumEntry={sumEntry}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Popular;
