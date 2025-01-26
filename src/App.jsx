import "./App.css";
import RouteSwitch from "./components/navigation/RouteSwitch";
import AuthProvider from "./contexts/AuthContext";
import ResponsiveDrawer from "./components/navigation/ResponsiveDrawer";

function App() {
  return (
    <>
      <AuthProvider>
        <ResponsiveDrawer />
        <RouteSwitch />
      </AuthProvider>
    </>
  );
}

export default App;
