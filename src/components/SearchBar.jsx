// SearchBar.jsx

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({ placeholder, onSearch, onSelect }) => {
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

  const handleSelect = (item) => {
    setValue(item);
    if (onSearch) onSearch(item);
    if (onSelect) onSelect(item); // Call onSelect prop to handle the selected item
  };

  return (
    <div style={{ position: 'relative' }}>
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
      {value && (
        <ul style={{ position: 'absolute', background: '#fff', zIndex: 1, margin: 0, padding: '0', listStyle: 'none', border: '1px solid #ccc', borderRadius: '4px' }}>
          {value && <li onClick={() => handleSelect(value)}>Select "{value}"</li>}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
