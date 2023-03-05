import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function Home(props) {
  let navigate = useNavigate();
  console.log("home", props.user);
  if (props.user == null) window.location = "/login";
  if (props.user && props.user.status == "ok") {
    navigate("/" + props.user.type);
  }

  return (
    <div className=" h-screen grid place-content-center bg-slate-100">
      <h1 className="font-bold text-center text-3xl uppercase m-6">
        DBMS Mini Project
      </h1>
    </div>
  );
}

export default Home;
