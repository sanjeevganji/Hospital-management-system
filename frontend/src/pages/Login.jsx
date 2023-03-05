import React, { useState } from "react";
import { login } from "../API";
import { useNavigate } from "react-router-dom";
function Login(props) {
  let navigate = useNavigate();
  let [valid, setValid] = useState(true);
  return (
    <form
      onSubmit={async (e) => {
        console.log("login");
        e.preventDefault(); //don't refresh
        //try to login and get user object
        let user = await login(
          e.target.username.value,
          e.target.password.value
        );
        if (user.status == "ok") {
          props.onSuccess(user);
          //go back to home
          navigate("/");
          return;
        }
        if (user.status == "error") {
          setValid(false);
          return;
        } else {
          alert("Something went wrong");
        }
      }}
      className="fixed w-screen h-screen grid place-content-center bg-slate-300 text-gray-700"
    >
      <h1 className="font-bold text-center text-3xl uppercase m-6">Login</h1>
      <span className="grid place-content-center gap-1 p-4 bg-slate-100  rounded-md shadow-xl mx-auto">
        <label className=" text-gray-600">Username</label>
        <input type="text" name="username" autoComplete="off" />
        <label className="mt-2 text-gray-600">Password</label>
        <input type="password" name="password" autoComplete="off" />
        <div
          className="text-red-500 mt-1"
          style={{ opacity: valid ? "0" : "1" }}
        >
          Invalid credentials
        </div>
        <button
          type="submit"
          className="
           orange mt-2
            "
        >
          Login
        </button>
      </span>
    </form>
  );
}

export default Login;
