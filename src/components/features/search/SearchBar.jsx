import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import MUI theme hook

const SearchBar = ({ placeholder }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const theme = useTheme(); // Get current theme (light/dark mode)

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
      navigate("/searchresults", { state: { query: value } });
      setValue("");
    }
  };

  const handleClear = () => {
    setValue("");
  };

  return (
    <Box sx={{ mr: "auto", ml: "auto" }}>
      <TextField
        variant="outlined"
        placeholder={placeholder || "Search for food..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          width: { xs: "100%", sm: "500px", md: "500px" },
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#f0f0f0",
          color: theme.palette.text.primary,
          borderRadius: "15px",
          transition: "background-color 0.3s ease, color 0.3s ease",
          "& .MuiOutlinedInput-root": {
            height: "39px",
            fontSize: "0.875rem",
            borderRadius: "15px",
            "& fieldset": {
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[400],
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
            },
          },
          "& .MuiInputBase-input": {
            padding: "8px 12px",
            color: theme.palette.text.primary,
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
