import React from "react";
import DataEntry from "./pages/DataEntry";
import FrontDesk from "./pages/FrontDesk";
import Doctor from "./pages/Doctor";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Home from "./pages/Home";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  let [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );
  let logInUser = (e) => {
    setUser(e);
    localStorage.setItem("user", JSON.stringify(e));
  };
  let logOutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home user={user} />,
    },
    {
      path: "/login",
      element: <Login onSuccess={logInUser} />,
    },
    {
      path: "/doctor",
      element: <Doctor user={user} onLogout={logOutUser} />,
    },
    {
      path: "/dataentry",
      element: <DataEntry user={user} onLogout={logOutUser} />,
    },
    {
      path: "/frontdesk",
      element: <FrontDesk user={user} onLogout={logOutUser} />,
    },
    {
      path: "/admin",
      element: <Admin user={user} onLogout={logOutUser} />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
