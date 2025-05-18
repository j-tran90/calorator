import { AddCircleOutline } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function SetTargetButton({ buttonText, buttonSize }) {
  return (
    <Box display='flex'>
      <Button
        variant='outlined'
        component={Link}
        to='/creategoal'
        sx={{ border: "none" }}
      >
        <AddCircleOutline sx={{ color: "#4caf50", fontSize: buttonSize }} />
        {buttonText}
      </Button>
    </Box>
  );
}
