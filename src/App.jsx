import "./App.css";
import RouteSwitch from "./components/navigation/RouteSwitch";
import AuthProvider from "./contexts/AuthContext";
import NavBar from "./components/navigation/NavBar";

function App() {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <RouteSwitch />
      </AuthProvider>
    </>
  );
}

export default App;
