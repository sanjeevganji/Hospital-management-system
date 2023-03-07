import React, { useEffect } from "react";
import { getUser } from "../log";
import { getAllPatientsForDataEntry } from "../API";

function DataEntry() {
  let [patients, setPatients] = React.useState([]);
  let [pop1, setPop1] = React.useState(null);

  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);

  useEffect(() => {
    if (!user) return;
    console.log({ user });
    getAllPatientsForDataEntry(user).then((res) => {
      setPatients(res);
    });
  }, [user]);

  return (
    <>
      <div className="px-6">
        <h2 className="mt-8 mb-2 shadow-lg ">Dashboard</h2>
        <div className="grid grid-cols-6 gap-3 mb-2 mt-4 text-center">
          <h3 className="col-span-1">Patient Name</h3>
          <h3 className="col-span-4">ID</h3>
          <h3 className="col-span-1">Add</h3>
        </div>
        <div className="flex flex-col gap-3 whitespace-nowrap mb-8">
          {patients.map((patients: any) => (
            <div className="grid grid-cols-6 gap-3" key={patients.appID}>
              <div className="card col-span-1">{patients.pID}</div>
              <div className="card col-span-4">{patients.Name}</div>
              <button
                onClick={async () => {
                  setPop1(patients.pID);
                }}
                className="blue"
              >
                Enter
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DataEntry;
