import "./App.css";
import RouteSwitch from "./components/navigation/RouteSwitch";
import AuthProvider from "./contexts/AuthContext";
import ResponsiveDrawer from "./components/navigation/ResponsiveDrawer";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

function App() {
  const location = useLocation();

  // Define routes where the drawer should be excluded
  const excludedRoutes = ["/profile"];

  // Check if the screen size is mobile
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <AuthProvider>
      {/* Render the drawer only if the current route is not excluded and the view is mobile */}
      {isMobile && !excludedRoutes.includes(location.pathname) && (
        <ResponsiveDrawer />
      )}
      <RouteSwitch />
    </AuthProvider>
  );
}

export default App;
