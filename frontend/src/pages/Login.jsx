import React, { useState } from "react";
import { login } from "../API";
function Login(props) {
  let [valid, setValid] = useState(true);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        let user = await login(
          e.target.username.value,
          e.target.password.value
        );
        if(user.status == "error"){
          setValid(false);
          return;
        }
        props.onUser(user);
      }}
      className="fixed w-screen h-screen grid place-content-center bg-slate-300 text-gray-700"
    >
      <h1 className="font-bold text-center text-3xl uppercase m-6">
        DBMS Mini Project
      </h1>
      <span className="grid place-content-center gap-1 p-4 bg-slate-100  rounded-md shadow-xl mx-auto">
        <label className=" text-gray-600">Username</label>
        <input type="text" name="username" autoComplete="off" />
        <label className="mt-2 text-gray-600">Password</label>
        <input type="password" name="password" autoComplete="off" />
        {valid ? null : <div className="text-red-500">Invalid credentials</div>}
        <button
          type="submit"
          className="
           orange mt-6
            "
        >
          Login
        </button>
      </span>
    </form>
  );
}

export default Login;
