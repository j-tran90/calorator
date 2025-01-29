import React from "react";
import { Link } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TodayIcon from "@mui/icons-material/Today";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from "@mui/icons-material/Settings";

const NavLinks = ({ onLinkClick, isBottomLinks }) => {
  const topLinks = [
    { to: "/today", text: "Today", icon: <TodayIcon /> },
    { to: "/dashboard", text: "Dashboard", icon: <SpaceDashboardIcon /> },
    { to: "/goals", text: "Goals", icon: <OutlinedFlagIcon /> },
    { to: "/profile", text: "Profile", icon: <AccountBoxIcon /> },
    { to: "/journal", text: "Journal", icon: <AutoStoriesIcon /> },
  ];

  const bottomLinks = [
    { to: "/settings", text: "Settings", icon: <SettingsIcon /> },
  ];

  const links = isBottomLinks ? bottomLinks : topLinks;

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
            {link.icon}
            <ListItemText primary={link.text} sx={{ml: 3 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default NavLinks;
