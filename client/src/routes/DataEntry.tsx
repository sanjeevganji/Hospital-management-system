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

  let [searchid, setSearchid] = React.useState(0);
  let [searchname, setSearchname] = React.useState("");
  function handleSearchId(e: any) {
    const id = parseInt(e.target.value);
    if (id < 0 || id.toString() == "NaN") {
      // alert("can't be less than 0");
      setSearchid(0);
      return;
    }
    setSearchid(id);
  }
  function handleSearchName(e: any) {
    const name = e.target.value;
    setSearchname(name);
  }
  function handlesubmitId() {
    setSearchid(0);
  }
  function handlesubmitName() {
    setSearchname("");
  }
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
        <h2 className="mt-8 mb-2 shadow-lg ">Add Prescription</h2>
        {/* SEARCH */}
        <div className="flex flex-wrap gap-6 mt-6 mb-2">
          <label className="flex-1 whitespace-nowrap">
            <div className="mb-2">Search by ID:</div>
            <span className="flex gap-3">
              <input
                className="card flex-1"
                type="number"
                value={searchid > 0 ? searchid : ""}
                onChange={handleSearchId}
              />
              <button className="red" onClick={handlesubmitId}>
                clear
              </button>
            </span>
          </label>
          <label className="flex-1 whitespace-nowrap">
            <div className="mb-2">Search by Patient Name:</div>
            <span className="flex gap-3">
              <input
                className="card flex-1"
                type="text"
                value={searchname}
                onChange={handleSearchName}
              />
              <button className="red" onClick={handlesubmitName}>
                clear
              </button>
            </span>
          </label>
        </div>
        <div className="grid grid-cols-6 gap-3 mt-6 mb-2 text-center shadow-lg">
          <h3 className="col-span-1">Appointment ID</h3>
          <h3 className="col-span-1">Prescription ID</h3>
          <h3 className="col-span-1">Patient Name</h3>
          <h3 className="col-span-1">Doctor</h3>
          <h3 className="col-span-1">Date</h3>
          <h3 className="col-span-1">Actions</h3>
        </div>
        <div className="flex flex-col gap-3 whitespace-nowrap mt-4 mb-8">
          {appointments.map(
            (app: any) =>
              ((searchid == 0 && searchname == "") ||
                (searchid != 0 &&
                  app.appID
                    .toString()
                    .toLowerCase()
                    .startsWith(searchid.toString().toLowerCase())) ||
                (searchname != "" &&
                  app.pName
                    .toLowerCase()
                    .startsWith(searchname.toLowerCase()))) && (
                <div className="grid grid-cols-6 gap-3 " key={app.appID}>
                  <div className="card col-span-1 text-center">
                    {app.appID || "-"}
                  </div>
                  <div className="card col-span-1 text-center">
                    {app.presID || "-"}
                  </div>
                  <div className="card col-span-1">{app.pName}</div>
                  <div className="card col-span-1">{app.dName}</div>
                  <div className="card col-span-1 text-center">
                    {formatDate(app.date)}
                  </div>
                  <button
                    className=" blue col-span-1"
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
              )
          )}
        </div>
        <h2 className="mt-8 mb-2 shadow-lg ">Upload Test Result and Report</h2>
        {/* SEARCH */}
        <div className="flex flex-wrap gap-6 mt-6 mb-2">
          <label className="flex-1 whitespace-nowrap">
            <div className="mb-2">Search by ID:</div>
            <span className="flex gap-3">
              <input
                className="card flex-1"
                type="number"
                value={searchid > 0 ? searchid : ""}
                onChange={handleSearchId}
              />
              <button className="red" onClick={handlesubmitId}>
                clear
              </button>
            </span>
          </label>
          <label className="flex-1 whitespace-nowrap">
            <div className="mb-2">Search by Patient Name:</div>
            <span className="flex gap-3">
              <input
                className="card flex-1"
                type="text"
                value={searchname}
                onChange={handleSearchName}
              />
              <button className="red" onClick={handlesubmitName}>
                clear
              </button>
            </span>
          </label>
        </div>
        <div className="grid grid-cols-6 gap-3 mt-6 mb-2 text-center shadow-lg">
          <h3 className="col-span-1">Appointment ID</h3>
          <h3 className="col-span-1">Prescription ID</h3>
          <h3 className="col-span-1">Patient Name</h3>
          <h3 className="col-span-1">Doctor</h3>
          <h3 className="col-span-1">Date</h3>
          <h3 className="col-span-1">Actions</h3>
        </div>
        <div className="flex flex-col gap-3 whitespace-nowrap mt-4 mb-8">
          {appointments.map(
            (app: any) =>
              ((searchid == 0 && searchname == "") ||
                (searchid != 0 &&
                  app.appID
                    .toString()
                    .toLowerCase()
                    .startsWith(searchid.toString().toLowerCase())) ||
                (searchname != "" &&
                  app.pName
                    .toLowerCase()
                    .startsWith(searchname.toLowerCase()))) && (
                <div className="grid grid-cols-6 gap-3 " key={app.appID}>
                  <div className="card col-span-1 text-center">
                    {app.appID || "-"}
                  </div>
                  <div className="card col-span-1 text-center">
                    {app.presID || "-"}
                  </div>
                  <div className="card col-span-1">{app.pName}</div>
                  <div className="card col-span-1">{app.dName}</div>
                  <div className="card col-span-1 text-center">
                    {formatDate(app.date)}
                  </div>
                  <button
                    className=" blue col-span-1"
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
              )
          )}
        </div>
      </div>
    </>
  );
}

export default DataEntry;
