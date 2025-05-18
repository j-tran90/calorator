import React from "react";
import Typography from "@mui/material/Typography";

const Header = ({ headText }) => {
  return (
    <Typography
      variant='h5'
      textAlign='left'
      sx={{ justifyContent: "center", flexDirection: "row" }}
    >
      {headText}
    </Typography>
  );
};

export default Header;
