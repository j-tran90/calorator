import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SearchBar = ({ placeholder }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      navigate("/searchresults", { state: { query: value } }); // Navigate to search results
    }
  };

  const handleClear = () => {
    setValue("");
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        variant='outlined'
        placeholder='Search for food...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position='end'>
              <IconButton onClick={handleClear} edge='end' size='small'>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          width: "60%",
          maxWidth: 400,
          backgroundColor: "#f0f0f0",
          borderRadius: 1,
          "& .MuiOutlinedInput-root": {
            height: "39px",
            fontSize: "0.875rem",
          },
          "& .MuiInputBase-input": {
            padding: "8px 12px",
          },
        }}
      />
    </div>
  );
};

export default SearchBar;
