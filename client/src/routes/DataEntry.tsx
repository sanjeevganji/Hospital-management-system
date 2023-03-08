import React, { useEffect } from "react";
import moment from "moment";
import { getUser } from "../log";
import { getAppointmentListForDataEntry } from "../API";
import EntryData from "../components/EntryData";

function DataEntry() {
  let [appointments, setAppointments] = React.useState([]);
  let [pop1, setPop1] = React.useState(null);

  const formatDate = (date: Date) => {
    let d = moment(date);
    return d.format("YYYY-MM-DD");
  };

  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);

  useEffect(() => {
    if (!user) return;
    console.log({ user });
    getAppointmentListForDataEntry(user).then((res) => {
      setAppointments(res);
    });
  }, [user]);

  return (
    <>
      <div className="px-6">
        <h2 className="mt-8 mb-2 shadow-lg ">Appointments</h2>
        <div className="grid grid-cols-10 gap-3 mb-2 mt-4 text-center">
          <h3 className="col-span-1">ID</h3>
          <h3 className="col-span-2">Patient</h3>
          <h3 className="col-span-2">Doctor</h3>
          <h3 className="col-span-2">Date</h3>
          <h3 className="col-span-3">Actions</h3>
        </div>
        <div className="flex flex-col gap-3 whitespace-nowrap mb-8">
          {appointments.map((app: any) => (
            <div
              className="grid grid-cols-10 gap-3 text-center"
              key={app.appID}
            >
              <div className="card col-span-1">{app.appID}</div>
              <div className="card col-span-2">{app.pName}</div>
              <div className="card col-span-2">{app.dName}</div>
              <div className="card col-span-2">{formatDate(app.date)}</div>
              <button
                className=" blue col-span-3"
                onClick={async () => {
                  setPop1(app.appID);
                }}
              >
                Add Prescription
              </button>
              <EntryData
                appID={app.appID}
                appDate={formatDate(app.date)}
                open={pop1 == app.appID}
                onClose={() => {
                  setPop1(null);
                  //update the list of appointments
                  getAppointmentListForDataEntry(user).then((res) => {
                    setAppointments(res);
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DataEntry;
