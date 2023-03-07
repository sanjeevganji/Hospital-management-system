import React, { useEffect } from "react";
import { getUser } from "../log";

function DataEntry() {
    //get the user who is logged in
    let [user, setUser] = React.useState<any>(null);
    useEffect(() => {
      getUser().then((user: any) => setUser(user));
    }, []);
  return (
    <>
      <div className="fixed inset-0 bg-slate-200 text-gray-700 overflow-y-scroll px-6">
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-2 place-items-center">
            <h1 className="justify-self-start text-gray-500 whitespace-nowrap">
              Welcome {user[0].username || "no username"}!
            </h1>
            <button
              onClick={async () => {
                user[1](null);
              }}
              className=" justify-self-end red"
            >
              log out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataEntry;
