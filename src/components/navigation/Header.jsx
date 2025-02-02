import React from "react";
import Typography from "@mui/material/Typography";

const Header = ({ headText }) => {
  return (
    <Typography variant='h5' textAlign='left'>
      {headText}
    </Typography>
  );
};

export default Header;
