import React, { useEffect } from "react";
import { addUser, deleteUser, getUsers } from "../API";
function Admin(props) {
  let users = React.useState([]);
  useEffect(() => {
    getUsers(props.$user[0].apikey).then((res) => {
      console.log(res);
      users[1](res.users);
    });
  }, []);
  return (
    <>
      <div className="fixed bg-slate-200 text-gray-700 w-full h-full overflow-y-scroll px-6">
        {/* <div>Admin : {props.$user[0].apikey}</div> */}
        <h1>
          Admin:
          <span className="text-gray-500"> {props.$user[0].username}</span>
        </h1>
        <div className="grid grid-cols-3 container mx-auto px-2 gap-x-2">
          <h2 className="col-span-3">Add new user</h2>
          <form
            className="col-span-3 grid grid-cols-3 gap-x-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await addUser(
                props.$user[0].apikey,
                e.target.username.value,
                e.target.password.value,
                e.target.type.value
              );
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
                <input
                  name="type"
                  value="admin"
                  type="radio"
                  className="mx-1"
                />
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
          <div className="col-span-3 grid grid-cols-3 mb-2 mt-8 gap-3 ">
            <h2>Username</h2>
            <h2>Type</h2>
            <h2>Action</h2>
          </div>

          <div className="col-span-3 flex flex-col gap-3 mb-16">
            {users[0].map((user) => (
              <div className="grid grid-cols-3 gap-3" key={user.id}>
                <div className="card">{user.username}</div>
                <div className="card">{user.type}</div>
                <button
                  onClick={() => {
                    deleteUser(props.$user[0].apikey, user.id);
                    getUsers(props.$user[0].apikey).then((res) => {
                      users[1](res.users);
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
      </div>
    </>
  );
}
export default Admin;
