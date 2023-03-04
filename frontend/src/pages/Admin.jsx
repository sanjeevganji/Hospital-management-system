import React, { useEffect } from "react";
import { addUser, deleteUser, getUsers } from "../API";
function Admin(props) {
  let users = React.useState([]);
  useEffect(() => {
    getUsers(props.$user[0]).then((res) => {
      if (res.status=="error"){
        return <div>{res.reason}</div>
      }
      users[1](res.data);
    });
  }, []);
  return (
    <>
      <div className="fixed inset-0 bg-slate-200 text-gray-700 overflow-y-scroll px-6">
        {/* <div>Admin : {props.$user[0].apikey}</div> */}

        <div className="container mx-auto px-2">
          <div className="grid grid-cols-2 place-items-center">
            <h1 className="justify-self-start text-gray-500 whitespace-nowrap">
              Welcome {props.$user[0].username || "no username"}!
            </h1>
            <button
              onClick={async () => {
                props.$user[1](null);
              }}
              className=" justify-self-end red"
            >
              log out
            </button>
          </div>
          <h2>Add new user</h2>
          <form
            className="grid grid-cols-3 gap-x-2"
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
