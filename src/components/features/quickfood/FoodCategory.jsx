import React from "react";
import { ButtonBase, Box, Typography, styled } from "@mui/material";
import { db, auth } from "../../../config/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
    const uid = auth.currentUser?.uid;

    if (!uid) {
      console.error("No authenticated user.");
      return;
    }

    try {
      // Use modular Firestore syntax
      const journalEntriesRef = collection(db, "journal", uid, "entries");
      await addDoc(journalEntriesRef, {
        calories: kcal,
        protein: protein,
        food: name,
        createdAt: serverTimestamp(), // Use serverTimestamp for createdAt
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
        m: 2,
      }}
    >
      {items.map((item) => (
        <ComplexButton
          key={item.id}
          onClick={() => addToJournal(item.kcal, item.protein, item.name)}
          sx={{
            backgroundImage: getButtonBackground(item.icon),
            height: { xxs: "100px", xs: "120px" },
            width: { xxs: "100px", xs: "120px" },
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
