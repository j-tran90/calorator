import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const User = ({ photoWidth }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <Box>
      <Link to='/profile'>
        <img
          src={
            currentUser.photoURL ||
            "https://cdn-icons-png.freepik.com/256/16783/16783993.png?semt=ais_hybrid"
          }
          alt='User Avatar'
          style={{
            borderRadius: "50%",
            width: photoWidth,
            objectFit: "cover",
            transition: "width 0.3s ease, height 0.3s ease",
          }}
        />
      </Link>
    </Box>
  );
};

export default User;
