import "./App.css";
import RouteSwitch from "./components/navigation/RouteSwitch";
import AuthProvider from "./contexts/AuthContext";
import NavBar from "./components/navigation/NavBar";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // Adjust this if your home route is different

  return (
    <>
      <AuthProvider>
        {!isHomePage && <NavBar />}{" "}
        {/* Render NavBar only if not on home page */}
        <RouteSwitch />
      </AuthProvider>
    </>
  );
}

export default App;
