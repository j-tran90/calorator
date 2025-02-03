import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ThemeProviderComponent from "./contexts/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProviderComponent>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProviderComponent>
  </React.StrictMode>
);
