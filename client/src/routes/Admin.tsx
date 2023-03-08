import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, deleteUser, getUsers as fetchUsers } from "../API";
import { getUser, tryLoggingOut } from "../log";

function Admin() {
  let [confirm, setConfirm] = React.useState(null);
  const navigate = useNavigate();
  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);
  //fetch the users from the server
  let [fetchedUsers, setFetchedUsers] = React.useState<any>(null);
  useEffect(() => {
    if (user)
      fetchUsers(user).then((res) => {
        setFetchedUsers(res.data);
      });
  }, [user]);

  useEffect(() => {
    console.log(fetchedUsers);
  }, [fetchedUsers]);

  return (
    <div className="px-6">
      <h1 className="mt-8 mb-2 ">Add new user</h1>
      <form
        className="shadow-lg grid grid-cols-4 gap-x-3"
        onSubmit={async (e) => {

          if((e.target as any).username.value.length < 6)
          {
            alert(
              "The length of Username must be atleast 6"
            )
            e.preventDefault();
            return;
          }
          console.log((e.target as any).username.value.charAt(0));
          if(! /[a-zA-Z]$/.test((e.target as any).username.value.charAt(0)))
          {
            alert(
              "first charecter of Username must be an Alphabet"
            )
            e.preventDefault();
            return;
          }
          if((e.target as any).password.value.length < 8)
          {
            alert(
              "your password is weak, length must be atleast 8"
            )
            e.preventDefault();
            return;
          }
          if(! /(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/.test((e.target as any).password.value))
          {
            alert(
              "password must contain both alphabet and number\nstarts with an Alphabet\nMust not contain spaces"
            )
            e.preventDefault();
            return;
          }
          let s = await addUser(
            user.username,
            user.password,
            (e.target as any).username.value,
            (e.target as any).password.value,
            (e.target as any).name.value,
            (e.target as any).type.value
          );
          console.log(s);
          if (s.status === "error") {
            alert(s.reason);
          }
          fetchUsers(user).then((res) => {
            setFetchedUsers(res.data);
          });
        }}
      >
        <div className="col-span-4 flex gap-4 py-2 ">
          <div>Type:</div>
          <label>
            <input
              name="type"
              value="doctor"
              type="radio"
              className="mx-1"
              defaultChecked
            />
            Doctor
          </label>
          <label>
            <input
              name="type"
              value="frontdesk"
              type="radio"
              className="mx-1"
            />
            Frontdesk
          </label>
          <label>
            <input
              name="type"
              value="dataentry"
              type="radio"
              className="mx-1"
            />
            Dataentry
          </label>
          <label>
            <input name="type" value="admin" type="radio" className="mx-1" />
            Admin
          </label>
        </div>
        <input
          type="text"
          placeholder="username"
          name="username"
          autoComplete="off"
        />
        <input type="text" placeholder="name" name="name" autoComplete="off" />
        <input
          type="password"
          placeholder="password"
          name="password"
          autoComplete="off"
        />
        <button className="blue">Add User</button>
      </form>
      <h1 className="mt-16 mb-2">Users</h1>
      <div className=" grid grid-cols-4 gap-3 mt-1 mb-2 shadow-lg text-center ">
        <h2>Username</h2>
        <h2>Name</h2>
        <h2>Type</h2>
        <h2>Action</h2>
      </div>
      <div className=" mb-16 mt-6 flex flex-col gap-3 ">
        {fetchedUsers?.map((fetchedUser: any) => (
          <div className="grid grid-cols-4 gap-3" key={fetchedUser.Username}>
            <div className="card whitespace-nowrap">{fetchedUser.Username}</div>
            <div className="card whitespace-nowrap">{fetchedUser.Name}</div>
            <div className="card whitespace-nowrap">{fetchedUser.Type}</div>
            <button
              disabled={fetchedUser.Type === "admin"}
              className={"col-span-1 orange"}
              style={{
                filter: `${
                  confirm === fetchedUser.Username ? "hue-rotate(-40deg)" : ""
                }`,
              }}
              onClick={async () => {
                if (confirm !== fetchedUser.Username) {
                  setConfirm(fetchedUser.Username);
                  return;
                }
                setConfirm(null);
                let s = await deleteUser(
                  user.username,
                  user.password,
                  fetchedUser.Username
                );
                if (s.status === "error") {
                  alert(s.reason);
                }
                fetchUsers(user).then((res) => {
                  setFetchedUsers(res.data);
                });
              }}
            >
              {confirm === fetchedUser.Username ? "Confirm?" : "Delete User"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
