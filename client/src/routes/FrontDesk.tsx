import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  getAllPatientsForFrontDesk as fetchAllPatients,
  getUsers as fetchUsers,
  registerPatient,
  scheduleAppointment,
} from "../API";
import ScheduleAppointmentPopUp from "../components/ScheduleAppointment";
import AdmitPatientPopUp from "../components/AdmitPatient";
import DischargePatientPopUp from "../components/DischargePatient";
import { getUser, tryLoggingOut } from "../log";

function FrontDesk() {
  let [get1, set1] = React.useState(null);
  let [get2, set2] = React.useState(null);
  let [get3, set3] = React.useState(null);
  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);
  //fetch the users from the server
  let [fetchedPatients, setFetchedPatients] = React.useState<any>(null);

  useEffect(() => {
    if (user)
      fetchAllPatients(user).then((res) => {
        setFetchedPatients(res);
      });
  }, [user]);

  useEffect(() => {
    console.log({ fetchedPatients });
  }, [fetchedPatients]);

  return (
    <div className="px-6">
      <h2 className="mt-8 mb-2 shadow-lg ">Register Patient</h2>
      <form
        className="grid grid-cols-2 gap-x-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await registerPatient(
            user.username,
            user.password,
            (e.target as any).name.value
          );
          fetchAllPatients(user).then((res) => {
            setFetchedPatients(res);
          });
        }}
      >
        <div className="col-span-2 flex gap-4 py-2 "></div>
        <input
          type="text"
          placeholder="patient name"
          name="name"
          autoComplete="off"
        />
        <button className="blue">Register Patient </button>
      </form>
      <div className=" grid grid-cols-12 gap-3 mt-8 mb-2 shadow-lg text-center">
        <h2>ID</h2>
        <h2 className=" col-span-7">Patient</h2>
        <h2 className=" col-span-4">Actions</h2>
      </div>
      <div className=" mb-16 mt-6 flex flex-col gap-3 ">
        {fetchedPatients?.map((fetchedPatient: any) => (
          <div className="grid grid-cols-12 gap-3" key={fetchedPatient.ID}>
            <div className="card whitespace-nowrap">{fetchedPatient.ID}</div>
            <div className="card col-span-7 whitespace-nowrap">
              {fetchedPatient.Name}
            </div>
            {fetchedPatient.admitted || true ? (
              <>
                <button
                  className="col-span-2 blue"
                  onClick={async () => {
                    set1(fetchedPatient.ID);
                  }}
                >
                  admit
                </button>
                <AdmitPatientPopUp
                  patientId={fetchedPatient.ID}
                  open={fetchedPatient.ID === get1}
                  onClose={() => {
                    set1(null);
                    fetchAllPatients(user).then((res) => {
                      setFetchedPatients(res);
                    });
                  }}
                />
              </>
            ) : (
              <>
                <button
                  className="col-span-2 blue"
                  onClick={async () => {
                    set2(fetchedPatient.ID);
                    fetchAllPatients(user).then((res) => {
                      setFetchedPatients(res);
                    });
                    //discharge
                  }}
                >
                  discharge
                </button>
                <DischargePatientPopUp
                  patientId={fetchedPatient.ID}
                  open={fetchedPatient.ID === get2}
                  onClose={() => {
                    set2(null);
                    fetchAllPatients(user).then((res) => {
                      setFetchedPatients(res);
                    });
                  }}
                />
              </>
            )}
            <button
              onClick={() => {
                set3(fetchedPatient.ID);
              }}
              className={"col-span-2 orange"}
            >
              appoint
            </button>
            <ScheduleAppointmentPopUp
              patientId={fetchedPatient.ID}
              open={fetchedPatient.ID === get3}
              onClose={() => {
                set3(null);
                fetchAllPatients(user).then((res) => {
                  setFetchedPatients(res);
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrontDesk;
