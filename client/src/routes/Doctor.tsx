import React, { useEffect, useState } from "react";
import { getAllPatientsForDoctor, getAppointments } from "../API";

import Tests from "../components/Tests";
import Treatments from "./Treatments";

import { getUser } from "../log";
function Doctor() {
  let [appointments, setAppointments] = React.useState([]);
  let [patients, setPatients] = React.useState([]);
  let [pop1, setPop1] = React.useState(null);
  let [pop2, setPop2] = React.useState(null);
  let [searchid, setSearchid] = React.useState(0);
  let [searchname, setSearchname] = React.useState("");
  let [searchid2, setSearchid2] = React.useState(0);
  let [searchname2, setSearchname2] = React.useState("");
  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);

  useEffect(() => {
    if (!user) return;
    getAppointments(user.username, user.password).then((res) => {
      console.log({ res });
      setAppointments(res.data);
    });
    getAllPatientsForDoctor(user).then((res) => {
      setPatients(res);
    });
  }, [user]);

  function handleSearchId(e:any)
  {
    const id = parseInt(e.target.value);
    if(id < 0 || id == undefined)
    {
      // alert("can't be less than 0");
      return;
    }
    console.log(id);
    setSearchid(id);
  }
  function handleSearchName(e:any)
  {
    const name = (e.target.value);
    setSearchname(name);
  }
  function handlesubmitId()
  {
    setSearchid(0);
  }
  function handlesubmitName()
  {
    setSearchname("");
  }


  function handleSearchId2(e:any)
  {
    const id = parseInt(e.target.value);
    if(id < 0 || id == undefined)
    {
      // alert("can't be less than 0");
      return;
    }
    console.log(id);
    setSearchid2(id);
  }
  function handleSearchName2(e:any)
  {
    const name = (e.target.value);
    setSearchname2(name);
  }
  function handlesubmitId2()
  {
    setSearchid2(0);
  }
  function handlesubmitName2()
  {
    setSearchname2("");
  }

  return (
    <>
      <div className="px-6">
        <h2 className="mt-8 mb-2 shadow-lg ">Dashboard</h2>
        <div>
          <label> search by id
            <input type="number" value={searchid > 0 ? searchid : ""} onChange={handleSearchId}/>
            <button onClick={handlesubmitId}>clear</button>
          </label>
          <br />
          <label> search by name
            <input type="text" value={searchname} onChange={handleSearchName}/>
            <button onClick={handlesubmitName}>clear</button>
          </label>
        </div>
        <div className="grid grid-cols-7 gap-3 mb-2 mt-4 text-center">
          <h3 className="col-span-1">Patient ID</h3>
          <h3 className="col-span-2">Patient Name</h3>
          <h3 className="col-span-2">Date</h3>
          <h3 className="col-span-2">Priority</h3>
        </div>
        <div className="flex flex-col gap-3 whitespace-nowrap mb-8">
          {appointments.sort((a:any, b:any) => {
           if(a.date > b.date) return 1;
           if(a.date < b.date) return -1;
           return b.priority - a.priority})

           && appointments.map((appointment: any) => (
            ((searchid == 0 && searchname == "") || (searchid != 0 && appointment.pID.toString().startsWith(searchid.toString())) || (searchname != "" && appointment.pName.startsWith(searchname))) &&
            (<div className="grid grid-cols-7 gap-3" key={appointment.appID}>
              <div className="card col-span-1">{appointment.pID}</div>
              <div className="card col-span-2">{appointment.pName}</div>
              <div className="card col-span-2">{appointment.date.slice(0,10)}</div>
              <div className="card col-span-2">{appointment.priority}</div>
            </div>)

          ))}
        </div>
        <h2 className="mt-8 mb-2 shadow-lg "> Patient Info </h2>
        <div>
          <label> search by id
            <input type="number" value={searchid2 > 0 ? searchid2 : ""} onChange={handleSearchId2}/>
            <button onClick={handlesubmitId2}>clear</button>
          </label>
          <br />
          <label> search by name
            <input type="text" value={searchname2} onChange={handleSearchName2}/>
            <button onClick={handlesubmitName2}>clear</button>
          </label>
        </div>
        <div className=" flex flex-col mb-16 ">
          <div className="grid grid-cols-5 gap-3 mb-2 mt-4">
            <h3 className=" col-span-1 ">ID</h3>
            <h3 className=" col-span-4 ">Name</h3>
          </div>
          <div className="flex flex-col gap-3 whitespace-nowrap">
            { patients.sort((a:any, b:any) => a.ID - b.ID) && patients.map((patient: any) => (
              ((searchid2 == 0 && searchname2 == "") || (searchid2 != 0 && patient.ID.toString().startsWith(searchid2.toString())) ||(searchname2 != "" && patient.Name.startsWith(searchname2))) &&
              <div className="grid grid-cols-5 gap-3" key={patient.ID}>
                <div className="card col-span-1 ">{patient.ID}</div>
                <div className=" col-span-4 flex gap-3">
                  <div className=" card flex-1">{patient.Name}</div>
                  <button
                    onClick={async () => {
                      setPop1(patient.id);
                    }}
                    className=" blue"
                  >
                    treatments
                  </button>
                  <button
                    onClick={async () => {
                      setPop2(patient.id);
                    }}
                    className="orange"
                  >
                    tests
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Treatments
        user={user}
        open={pop1}
        onClose={() => {
          setPop1(null);
        }}
      />
      <Tests
        user={user}
        open={pop2}
        onClose={() => {
          setPop2(null);
        }}
      />
    </>
  );
}
export default Doctor;
