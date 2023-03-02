import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";

//remove StrictMode to render things once
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
