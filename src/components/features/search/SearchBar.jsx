import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const SearchBar = ({ placeholder }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

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
    <>
      <Box sx={{ mr: "auto", ml: "auto" }}>
        <TextField
          variant='outlined'
          placeholder={placeholder || "Search for food..."}
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
            width: { xs: "100%", sm: "500px", md: "500px" },
            backgroundColor: "#f0f0f0",
            borderRadius: "15px",
            "& .MuiOutlinedInput-root": {
              height: "39px",
              fontSize: "0.875rem",
              borderRadius: "15px",
            },
            "& .MuiInputBase-input": {
              padding: "8px 12px",
            },
          }}
        />
      </Box>
    </>
  );
};

export default SearchBar;
