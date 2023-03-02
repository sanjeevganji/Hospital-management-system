import React, { useEffect } from "react";
import { getAllPatients, getAppointments } from "../API";
import Tests from "../components/Tests";
import Treatments from "../components/Treatments";
function Doctor(props) {
  let $appointments = React.useState([]);
  let $patients = React.useState([]);
  let $showTreatments = React.useState(null);
  let $showTests = React.useState(null);
  useEffect(() => {
    getAppointments(props.$user[0].apikey).then((res) => {
      $appointments[1](res.appointments);
    });
    getAllPatients(props.$user[0].apikey).then((res) => {
      $patients[1](res.patients);
    });
  }, []);
  return (
    <>
      <div className="fixed inset-0 bg-slate-200 text-gray-700 overflow-y-scroll px-6">
        {/* <div>Doctor : {props.$user[0].apikey}</div> */}

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
          <h2>Dashboard</h2>
          <div className="grid grid-cols-5 gap-3 mb-2 mt-4">
            <h3 className="col-span-2">Patient Name</h3>
            <h3 className="col-span-2">Date Time</h3>
            <h3 className="col-span-1">Priority</h3>
          </div>
          <div className="flex flex-col gap-3 whitespace-nowrap mb-8">
            {$appointments[0].map((appointment) => (
              <div className="grid grid-cols-5 gap-3" key={appointment.id}>
                <div className="card col-span-2">{appointment.patientName}</div>
                <div className="card col-span-2">{appointment.datetime}</div>
                <div className="card col-span-1">{appointment.priority}</div>
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
              {$patients[0].map((patient) => (
                <div className="grid grid-cols-5 gap-3" key={patient.id}>
                  <div className="card col-span-1 ">{patient.id}</div>
                  <div className=" col-span-4 flex gap-3">
                    <div className=" card flex-1">{patient.name}</div>
                    <button
                      onClick={async () => {
                        $showTreatments[1](patient.id);
                      }}
                      className=" blue"
                    >
                      treatments
                    </button>
                    <button
                      onClick={async () => {
                        $showTests[1](patient.id);
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
        patientId={$showTreatments[0]}
        onClose={() => {
          $showTreatments[1](false);
        }}
      />
      <Tests
        patientId={$showTests[0]}
        onClose={() => {
          $showTests[1](false);
        }}
      />
    </>
  );
}
export default Doctor;
