import "./App.css";
import RouteSwitch from "./components/RouteSwitch";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <RouteSwitch />
      </AuthProvider>
    </>
  );
}

export default App;
