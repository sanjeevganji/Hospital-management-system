import React, { useEffect, useState } from "react";
import { getTreatments, scheduleAppointment } from "../API";
import { getUser } from "../log";

function ScheduleAppointment(props: any) {
  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  let [tries, setTrys] = useState(0);
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
            let s = await scheduleAppointment(
              user.username,
              user.password,
              patientId,
              (e.target as any).scheduleDate.value,
              (e.target as any).priority.value
            );
            if (s.err) {
              setTrys(tries + 1);
              return;
            }
            onClose();
          }}
        >
          <div className="col-span-2 flex flex-col gap-2 py-2 mb-2">
            <label className="text-gray-500">Schedule Date</label>
            <input
              min={new Date().toISOString().split("T")[0]}
              type="date"
              placeholder="patient name"
              name="scheduleDate"
              autoComplete="off"
              required
            />
            <label className="text-gray-500 mt-2">Priority</label>
            <input
              type="number"
              placeholder="priority"
              name="priority"
              autoComplete="off"
              required
            />
          </div>
          <div
            className="text-red-500 mt-1 col-span-2"
            style={{ opacity: tries == 0 ? "0" : "1" }}
          >
            Invalid details
          </div>
          <div className="flex col-span-2 justify-end">
            <span
              onClick={() => {
                onClose();
              }}
              className="underline h-10 leading-10 mx-4 cursor-pointer"
            >
              cancel
            </span>
            <button type="submit" className="orange w-fit ">
              Appoint
            </button>
          </div>
        </form>
      </span>
    </div>
  );
}

export default ScheduleAppointment;
