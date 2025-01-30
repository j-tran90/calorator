import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import User from "../layouts/User"; // Ensure this path is correct
import NavLinks from "./NavLinks";
import { Stack, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useAuth } from "../../contexts/AuthContext"; // Import your AuthContext
import Brand from "../layouts/Brand";
import SearchBar from "../features/search/SearchBar";

const drawerWidth = 240;

function ResponsiveDrawer(props, topLinks, bottomLinks) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "73px",
        }}
      >
        <Brand />
      </Box>

      <List sx={{ flexGrow: 1, width: "100%" }}>
        <NavLinks onLinkClick={handleDrawerClose} />
      </List>
      <Divider sx={{ width: "100%" }} />
      <Box sx={{ mt: "auto", width: "100%"}}>
        <NavLinks onLinkClick={handleDrawerClose} isBottomLinks={true} />
      </Box>
      <Divider sx={{ width: "100%" }} />
      <Box>
        <Typography variant='caption'>Version 1.0</Typography>
      </Box>
    </Box>
  );

  if (!currentUser) {
    return null;
  }

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ backgroundColor: "#fff", boxShadow: "none" }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            sx={{ width: "100%" }}
          >
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{  display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <SearchBar />
          </Stack>
          <User />
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // bgcolor: "#062118",
              // color: "#fff",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      ></Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
