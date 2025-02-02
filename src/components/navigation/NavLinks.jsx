import React from "react";
import { Link, useLocation } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TodayIcon from "@mui/icons-material/Today";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from "@mui/icons-material/Settings";
import { BarChart } from "@mui/icons-material";
import Box from "@mui/material/Box";

const NavLinks = ({ onLinkClick, isBottomLinks }) => {
  const location = useLocation();

  const topLinks = [
    { to: "/overview", text: "Overview", icon: <SpaceDashboardIcon /> },
    { to: "/today", text: "Today", icon: <TodayIcon /> },
    { to: "/dashboard", text: "Statistic", icon: <BarChart /> },
    { to: "/journal", text: "Journal", icon: <AutoStoriesIcon /> },
    { to: "/goals", text: "Goals", icon: <OutlinedFlagIcon /> },
    { to: "/profile", text: "Profile", icon: <AccountBoxIcon /> },
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
            sx={{
              pl: 4,
              position: "relative",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            {link.icon}
            <ListItemText primary={link.text} sx={{ ml: 3 }} />
            {location.pathname === link.to && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "6px",
                  backgroundColor: "#4FC483",
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default NavLinks;
