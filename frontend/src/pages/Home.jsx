import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function Home(props) {
  let navigate = useNavigate();
  console.log("home", props.user);
  useEffect(() => {
    if (props.user && props.user.status == "ok") {
      navigate("/" + props.user.type);
    }
  }, []);
  return (
    <div className=" h-screen grid place-content-center bg-slate-100">
      <h1 className="font-bold text-center text-3xl uppercase m-6">
        DBMS Mini Project
      </h1>
      <button className="orange" onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  );
}

export default Home;
