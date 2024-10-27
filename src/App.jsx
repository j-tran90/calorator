import "./App.css";
import RouteSwitch from "./components/RouteSwitch";
import AuthProvider from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <AuthProvider>
        <DarkModeProvider>
          <NavBar />
          <RouteSwitch />
        </DarkModeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
