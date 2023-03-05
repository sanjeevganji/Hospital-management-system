import React from "react";
import { useNavigate } from "react-router-dom";
function User(props) {
  console.log("user", props.user);
  let navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 place-items-center">
        <h1 className="justify-self-start text-gray-500 whitespace-nowrap">
          Welcome {props.user.username || "no username"}!
        </h1>
        <button
          onClick={async () => {
            props.onLogout();
            //go back to home
            navigate("/");
          }}
          className=" justify-self-end red"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default User;
