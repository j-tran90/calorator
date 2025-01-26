import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import ResponsiveDrawer from "../navigation/ResponsiveDrawer"; // Ensure this path is correct
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { currentUser } = useAuth();

  return (
    <div
      id='main-layout'
      className={`${!currentUser ? "no-drawer" : "drawer-open"}`}
    >
      {currentUser && <ResponsiveDrawer />}
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
