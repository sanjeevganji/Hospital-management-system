import React, { useEffect } from "react";
import {
  addUser,
  deleteUser,
  getAllPatients,
  getAppointments,
  getUsers,
} from "../API";
function Doctor(props) {
  let appointments = React.useState([]);
  let patients = React.useState([]);
  useEffect(() => {
    getAppointments(props.$user[0].apikey).then((res) => {
      console.log(res);
      appointments[1](res.appointments);
    });
    getAllPatients(props.$user[0].apikey).then((res) => {
      patients[1](res.patients);
    });
  }, []);
  return (
    <>
      <div className="fixed bg-slate-200 text-gray-700 w-full h-full overflow-y-scroll px-6">
        {/* <div>Doctor : {props.$user[0].apikey}</div> */}
        <h1>
          Doctor:
          <span className="text-gray-500"> {props.$user[0].username}</span>
        </h1>
        <div className="container mx-auto px-2">
          <h2>Dashboard</h2>
          <div className="grid grid-cols-5 gap-3 mb-2 mt-4">
            <h2 className="col-span-2">Patient Name</h2>
            <h2 className="col-span-2">Date Time</h2>
            <h2 className="col-span-1">Priority</h2>
          </div>
          <div className="flex flex-col gap-3 whitespace-nowrap">
            {appointments[0].map((appointment) => (
              <div className="grid grid-cols-5 gap-3" key={appointment.id}>
                <div className="card col-span-2">{appointment.patientName}</div>
                <div className="card col-span-2">{appointment.datetime}</div>
                <div className="card col-span-1">{appointment.priority}</div>
              </div>
            ))}
          </div>
          <h2 className="mt-4 mb-2">All Patients</h2>
          <div className="grid grid-cols-2 gap-3 ">
            <h3 className="card flex flex-col ">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">Name</div>
              </div>
              <div className="flex flex-col gap-3 whitespace-nowrap">
                {patients[0].map((patient) => (
                  <div
                    className="card grid grid-cols-4 gap-3  my-10"
                    key={patient.id}
                  >
                    <div className="card col-span-1">{patient.id}</div>
                    <div className="card col-span-3">{patient.name}</div>
                  </div>
                ))}
              </div>
            </h3>
            <div className="relative  grid  grid-rows-2 gap-3">
              <div className="card row-span-1">treatments</div>
              <div className="card row-span-1">tests</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Doctor;
