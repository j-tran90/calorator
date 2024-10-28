import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const handleSearch = (event) => {
    if (event.key === "Enter" && onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <TextField
      variant='outlined'
      placeholder={placeholder}
      onKeyPress={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        width: "60%",
        maxWidth: 400, // Adjust as needed
        backgroundColor: "#f0f0f0",
        borderRadius: 1,
      }}
    />
  );
};

export default SearchBar;
