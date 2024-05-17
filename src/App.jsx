import "./App.css";
import RouteSwitch from "./components/RouteSwitch";
import AuthProvider from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";

function App() {
  return (
    <>
      <AuthProvider>
        <DarkModeProvider>
          <RouteSwitch />
        </DarkModeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
