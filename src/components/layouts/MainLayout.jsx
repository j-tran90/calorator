import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ResponsiveDrawer from "../navigation/ResponsiveDrawer"; // Ensure this path is correct
import { Outlet } from "react-router-dom";
import { useTheme, useMediaQuery, Container } from "@mui/material";

const MainLayout = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--mui-background",
      theme.palette.background.default
    );
    document.documentElement.style.setProperty(
      "--mui-text",
      theme.palette.text.primary
    );
  }, [theme]);

  return (
    <div
      id='main-layout'
      className={`${!currentUser ? "no-drawer" : "drawer-open"}`}
      style={{
        backgroundColor: "#9993",
        color: "var(--mui-text)",
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Only show ResponsiveDrawer on larger screens, hide on mobile */}
      {currentUser && !isMobile && <ResponsiveDrawer />}
      <div className='content'>
        {/* Conditionally render Container based on isMobile */}
        {isMobile ? (
          <div className='mobile-content'>
            <Outlet />
          </div>
        ) : (
          <Container>
            <Outlet />
          </Container>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
