import React from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import your AuthContext
import { Link } from "react-router-dom";

const User = () => {
  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  // If currentUser is null, return null to not render anything
  if (!currentUser) {
    return null;
  }

  return (
    <div style={{padding: ".5rem"}}>
    <Link to="/profile">  <img
        src={
          currentUser.photoURL ||
          "https://cdn-icons-png.flaticon.com/256/9230/9230519.png"
        }
        alt='User Avatar'
        style={{ borderRadius: "50%", width: "50px", height: "50px"}}
      /></Link>
    </div>
  );
};

export default User;
