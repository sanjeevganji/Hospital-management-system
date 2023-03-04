import React from "react";
import DataEntry from "./pages/DataEntry";
import FrontDesk from "./pages/FrontDesk";
import Doctor from "./pages/Doctor";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

function App() {
  let $user = React.useState(null);
  switch ($user[0]?.type) {
    case "dataentry":
      return <DataEntry $user={$user} />;
    case "frontdesk":
      return <FrontDesk $user={$user} />;
    case "doctor":
      return <Doctor $user={$user} />;
    case "admin":
      return <Admin $admin={$user} />;
    default:
      return (
        <Login
          onUser={(user) => {
            $user[1](user);
          }}
        />
      );
  }
}

export default App;
