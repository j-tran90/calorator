import React from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import your AuthContext
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const User = () => {
  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  // If currentUser is null, return null to not render anything
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
            width: "50px",
            objectFit: "cover", // Ensures the image maintains aspect ratio
            transition: "width 0.3s ease, height 0.3s ease", // Smooth transition for resizing
          }}
        />
      </Link>
    </Box>
  );
};

export default User;
