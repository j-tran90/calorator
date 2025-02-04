import { CircularProgress } from "@mui/material";
import React from "react";

const LoadingScreen = () => {
  return (
    <div className='loading-screen'>
      <p>Loading...</p>
      <CircularProgress />
    </div>
  );
};

export default LoadingScreen;
