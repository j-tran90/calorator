import { Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function SetTargetButton() {
  return (
    <>
      {" "}
      <Box display='flex' justifyContent='center' m={3}>
        <Button
          variant='contained'
          component={Link}
          to='/creategoal'
          sx={{
            backgroundColor: "#000",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Set New Target
        </Button>
      </Box>
    </>
  );
}
