import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";

const BackButton = ({ sx = {} }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant='outlined'
      startIcon={<ArrowBackIos />}
      onClick={() => navigate(-1)}
      sx={{
        marginBottom: 1,
        border: "0px",
        ...sx, // Allow custom styles to be passed
      }}
    ></Button>
  );
};

export default BackButton;
