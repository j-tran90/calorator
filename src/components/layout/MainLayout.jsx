// src/components/layout/MainLayout.jsx
import React from "react";
import NavBar from "../navigation/NavBar";

const MainLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div>{children}</div>
    </>
  );
};

export default MainLayout;
