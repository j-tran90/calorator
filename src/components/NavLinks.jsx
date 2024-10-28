import React from "react";
import { Link } from "react-router-dom";

export default function NavLinks() {
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/profile", label: "Profile" },
    { path: "/journal", label: "Journal" },
  ];
  return (
    <>
      {navLinks.map((link) => (
        <li key={link.path}>
          <Link to={link.path}>{link.label}</Link>
        </li>
      ))}
    </>
  );
}
