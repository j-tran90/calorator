import React from "react";
import { ButtonBase, Box, Typography, styled } from "@mui/material";
import { db, auth, timestamp } from "../../../config/Firebase";

// Styled ButtonBase component
const ComplexButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "120px",
  height: "120px",
  borderRadius: "20px",
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
    transform: "scale(1.05)",
    transition: "all 0.3s ease-in-out",
  },
}));

const FoodCategory = ({ items, sumEntry, updateTotal }) => {
  const addToJournal = async (kcal, protein, name) => {
    const uid = auth.currentUser.uid;

    try {
      await db.collection("journal").doc(uid).collection("entries").doc().set({
        calories: kcal,
        protein: protein,
        food: name,
        createdAt: timestamp,
      });

      sumEntry();
      updateTotal();
    } catch (error) {
      console.error("Error adding entry to journal:", error);
    }
  };

  const getButtonBackground = (iconUrl) => {
    return iconUrl ? `url(${iconUrl})` : "#4FC483";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        p: 2,
      }}
    >
      {items.map((item) => (
        <ComplexButton
          key={item.id}
          onClick={() => addToJournal(item.kcal, item.protein, item.name)}
          style={{
            backgroundImage: getButtonBackground(item.icon),
          }}
        >
          <Typography
            variant='body2'
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {item.name}
          </Typography>
          <Typography
            variant='caption'
            sx={{
              position: "absolute",
              bottom: 10,
              fontSize: "10px",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            +{item.kcal} kcal
          </Typography>
        </ComplexButton>
      ))}
    </Box>
  );
};

export default FoodCategory;
