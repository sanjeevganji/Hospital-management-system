import React, { useEffect, useState } from "react";
import { getTreatments, scheduleAppointment } from "../API";
import { getUser } from "../log";

function ScheduleAppointment(props: any) {
  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);
  let { patientId, open, onClose } = props;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);
  return (
    <div
      className="fixed inset-0 grid place-content-center 
    bg-slate-300 text-gray-700 px-6
    "
      style={{ display: open ? "grid" : "none" }}
    >
      <h1 className="ml-4">Schedule Appointment of Patient {patientId}</h1>
      <span className="grid place-content-center gap-1 p-4 bg-slate-100  rounded-md shadow-xl mx-auto">
        <form
          className="grid grid-cols-2 gap-x-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await scheduleAppointment(
              user.username,
              user.password,
              patientId,
              (e.target as any).scheduleDate.value,
              (e.target as any).priority.value
            );
            onClose();
          }}
        >
          <div className="col-span-2 flex flex-col gap-2 py-2 ">
            <label className="text-gray-500">Schedule Date</label>
            <input
              type="date"
              placeholder="patient name"
              name="scheduleDate"
              autoComplete="off"
            />
            <label className="text-gray-500 mt-2">Priority</label>
            <input
              type="number"
              placeholder="priority"
              name="priority"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className=" col-span-2 orange w-fit place-self-end"
          >
            Appoint
          </button>
        </form>
      </span>
    </div>
  );
}

export default ScheduleAppointment;
