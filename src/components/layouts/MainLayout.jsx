import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import ResponsiveDrawer from "../navigation/NavBar"; // Ensure this path is correct
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Render ResponsiveDrawer only if currentUser is not null */}
      {currentUser && <ResponsiveDrawer />}
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default MainLayout;
