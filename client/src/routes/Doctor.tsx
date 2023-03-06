import React, { useEffect } from "react";
import { getAllPatientsForDoctor, getAppointments } from "../API";

import Tests from "../components/Tests";
import Treatments from "./Treatments";

import { getUser } from "../log";
function Doctor() {
  let [appointments, setAppointments] = React.useState([]);
  let [patients, setPatients] = React.useState([]);
  let [pop1, setPop1] = React.useState(null);
  let [pop2, setPop2] = React.useState(null);

  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);

  useEffect(() => {
    if (!user) return;
    getAppointments(user.username, user.password).then((res) => {
      setAppointments(res.data);
    });
    getAllPatientsForDoctor(user).then((res) => {
      setPatients(res);
    });
  }, [user]);

  console.log({ appointments, patients });
  return (
    <>
      <div className="fixed inset-0 bg-slate-200 text-gray-700 overflow-y-scroll px-6">
        <div className="container mx-auto px-2">
          <h2>Dashboard</h2>
          <div className="grid grid-cols-5 gap-3 mb-2 mt-4">
            <h3 className="col-span-2">Patient Name</h3>
            <h3 className="col-span-2">Date Time</h3>
            <h3 className="col-span-1">Priority</h3>
          </div>
          <div className="flex flex-col gap-3 whitespace-nowrap mb-8">
            {appointments.map((appointment: any) => (
              <div className="grid grid-cols-5 gap-3" key={appointment.ID}>
                <div className="card col-span-2">{appointment.Patient}</div>
                <div className="card col-span-2">{appointment.Date}</div>
                <div className="card col-span-1">{appointment.Priority}</div>
              </div>
            ))}
          </div>
          <h2>Patients</h2>
          <div className=" flex flex-col mb-16 ">
            <div className="grid grid-cols-5 gap-3 mb-2 mt-4">
              <h3 className=" col-span-1 ">ID</h3>
              <h3 className=" col-span-4 ">Name</h3>
            </div>
            <div className="flex flex-col gap-3 whitespace-nowrap">
              {patients.map((patient: any) => (
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
