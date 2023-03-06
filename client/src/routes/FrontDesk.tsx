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
import { getUser, tryLoggingOut } from "../log";

function FrontDesk() {
  const navigate = useNavigate();
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
    console.log(fetchedPatients);
  }, [fetchedPatients]);

  return (
    <div className="px-6">
      <h2 className="mt-8 mb-2 shadow-lg ">Register Patient</h2>
      <form
        className="grid grid-cols-3 gap-x-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await registerPatient(
            user.username,
            user.password,
            (e.target as any).name.value
          );
          fetchAllPatients(user).then((res) => {
            setFetchedPatients(res.json);
          });
        }}
      >
        <div className="col-span-3 flex gap-4 py-2 "></div>
        <input
          type="text"
          placeholder="patient name"
          name="name"
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          autoComplete="off"
        />
        <button className="blue">Register Patient </button>
      </form>
      <div className=" grid grid-cols-12 gap-3 mt-8 mb-2 shadow-lg">
        <h2>ID</h2>
        <h2 className=" col-span-3">Patient</h2>
        <h2>Actions</h2>
      </div>
      <div className=" mb-16 mt-6 flex flex-col gap-3 ">
        {fetchedPatients?.map((fetchedPatient: any) => (
          <div className="grid grid-cols-12 gap-3" key={fetchedPatient.ID}>
            <div className="card whitespace-nowrap">{fetchedPatient.ID}</div>
            <div className="card col-span-3 whitespace-nowrap">
              {fetchedPatient.Name}
            </div>
            {fetchedPatient.admitted || true ? (
              <button
                className="col-span-2 red"
                onClick={async () => {
                  await deleteUser(
                    user.username,
                    user.password,
                    fetchedPatient.Username
                  );
                  if (user.username == fetchedPatient.Username) {
                    tryLoggingOut(navigate);
                  }
                  fetchUsers(user).then((res) => {
                    setFetchedPatients(res.json);
                  });
                }}
              >
                admit
              </button>
            ) : (
              <button
                className="col-span-2 red"
                onClick={async () => {
                  await deleteUser(
                    user.username,
                    user.password,
                    fetchedPatient.Username
                  );
                  if (user.username == fetchedPatient.Username) {
                    tryLoggingOut(navigate);
                  }
                  fetchUsers(user).then((res) => {
                    setFetchedPatients(res.json);
                  });
                }}
              >
                discharge
              </button>
            )}
            <button
              onClick={() => {
                open("google.com");
              }}
              className={"col-span-6 orange"}
            >
              appoint
              <ScheduleAppointmentPopUp patientId={fetchedPatient.ID} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrontDesk;
