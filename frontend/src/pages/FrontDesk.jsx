import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import User from "./User";
function FrontDesk(props) {
  console.log(props.user);
  let navigate = useNavigate();
  useEffect(() => {
    if (
      props.user &&
      props.user.status == "ok" &&
      props.user.type == "frontdesk"
    ) {
      //do something
    } else {
      //go back to home
      navigate("/");
    }
  }, []);
  return (
    <div className="my-container">
      <User user={props.user} onLogout={props.onLogout} />
    </div>
  );
}

export default FrontDesk;
