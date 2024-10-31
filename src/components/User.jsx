import React from "react";
import { useAuth } from "../contexts/AuthContext"; // Import your AuthContext
import Brand from "./layouts/Brand";

const User = () => {
  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  // If currentUser is null, return null to not render anything
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      {/* Render user information when logged in */}
      <h2><Brand /></h2>
      <img
        src={
          currentUser.photoURL ||
          "https://cdn-icons-png.flaticon.com/256/9230/9230519.png"
        }
        alt='User Avatar'
        style={{ borderRadius: "50%", width: "50px", height: "50px" }}
      />
    </div>
  );
};

export default User;
