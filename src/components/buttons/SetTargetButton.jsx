import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function SetTargetButton({ buttonText, buttonHeight }) {
  return (
    <Box display='flex'>
      <Button
        variant='outlined'
        component={Link}
        to='/creategoal'
        sx={{
          height: buttonHeight || "36px",
          color: "#4caf50",
          "&:hover": { backgroundColor: "#333" },
          borderColor: "#4caf50",
        }}
      >
        <Add sx={{ color: "#4caf50" }} />
        {buttonText}
      </Button>
    </Box>
  );
}
