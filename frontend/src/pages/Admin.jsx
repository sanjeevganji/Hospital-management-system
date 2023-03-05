import React, { useEffect } from "react";
import { addUser, deleteUser, getUsers } from "../API";
import { useNavigate } from "react-router-dom";
import User from "./User";
function Admin(props) {
  console.log(props.user);
  let navigate = useNavigate();
  let users = React.useState([]);
  useEffect(() => {
    if (props.user && props.user.status == "ok" && props.user.type == "admin") {
      getUsers(props.user);
    } else {
      navigate("/");
    }
  }, []);
  return (
    <div className="my-container">
      <User user={props.user} onLogout={props.onLogout} />
      <h2>Add new user</h2>
      <form
        className="grid grid-cols-3 gap-x-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await addUser(
            props.user.username,
            props.user.password,
            e.target.username.value,
            e.target.password.value,
            e.target.type.value
          );
          getUsers(props.user).then((res) => {
            if (res.status == "error") {
              return <div>{res.reason}</div>;
            }
            users[1](res.data);
          });
        }}
      >
        <div className="col-span-3 flex gap-4 py-2">
          <div>type:</div>
          <label>
            <input
              name="type"
              value="doctor"
              type="radio"
              className="mx-1"
              defaultChecked
            />
            doctor
          </label>
          <label>
            <input
              name="type"
              value="frontdesk"
              type="radio"
              className="mx-1"
            />
            frontdesk
          </label>
          <label>
            <input
              name="type"
              value="dataentry"
              type="radio"
              className="mx-1"
            />
            dataentry
          </label>
          <label>
            <input name="type" value="admin" type="radio" className="mx-1" />
            admin
          </label>
        </div>
        <input
          type="text"
          placeholder="username"
          name="username"
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          autoComplete="off"
        />
        <button className="blue">add user</button>
      </form>
      <div className="grid grid-cols-3 mb-2 mt-8 gap-3 ">
        <h2>Username</h2>
        <h2>Type</h2>
        <h2>Action</h2>
      </div>

      <div className="flex flex-col gap-3 mb-16">
        {users[0].map((user) => (
          <div className="grid grid-cols-3 gap-3" key={user.Username}>
            <div className="card">{user.Username}</div>
            <div className="card">{user.Type}</div>
            <button
              onClick={() => {
                deleteUser(
                  props.user.username,
                  props.user.password,
                  user.username
                );
                getUsers(props.user).then((res) => {
                  if (res.status == "error") {
                    return <div>{res.reason}</div>;
                  }
                  users[1](res.data);
                });
              }}
              className="red"
            >
              delete user
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Admin;
