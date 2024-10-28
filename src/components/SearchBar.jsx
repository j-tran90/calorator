import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({ placeholder, onSearch }) => {
  const [value, setValue] = useState("");

  const handleSearch = (event) => {
    if (event.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setValue("");
    if (onSearch) onSearch("");
  };

  return (
    <TextField
      variant='outlined'
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyPress={handleSearch}
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
  );
};

export default SearchBar;
