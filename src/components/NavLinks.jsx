import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const NavLinks = ({ onLinkClick }) => {
  const links = [
    { to: "/dashboard", text: "Dashboard" },
    { to: "/profile", text: "Profile" },
    { to: "/journal", text: "Journal" },
  ];

  return (
    <>
      {links.map((link) => (
        <ListItem key={link.text} disablePadding>
          <ListItemButton
            component={Link}
            to={link.to}
            onClick={() => {
              onLinkClick();
            }}
          >
            <ListItemText primary={link.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default NavLinks;
