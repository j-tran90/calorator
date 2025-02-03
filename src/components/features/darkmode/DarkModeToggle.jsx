import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import { ThemeContext } from "../../../contexts/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";


const DarkModeToggle = () => {
  const { mode, setMode } = useContext(ThemeContext);

  return (
    <IconButton
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
      color='inherit'
    >
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default DarkModeToggle;
