import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";     // ✅ this loads global base styles
import "./App.css";       // ✅ this loads all custom app styles
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
