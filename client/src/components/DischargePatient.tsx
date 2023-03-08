import React, { useEffect, useState } from "react";
import { getTreatments, scheduleAppointment, dischargePatient } from "../API";
import { getUser } from "../log";

function DischargePatient(props: any) {
  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);
  let { patientId, open, onClose } = props;
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  return (
    <div
      className="fixed inset-0 grid place-content-center 
    bg-black text-gray-700 px-6 bg-opacity-30 overflow-y-auto
    "
      style={{ display: open ? "grid" : "none" }}
    >
      <span className="grid place-content-center gap-1 p-4 bg-slate-100  rounded-md shadow-xl mx-auto ">
        <h2 className="text-center m-2 mb-4">Confirm?</h2>
        <div className="flex justify-end">
          <span
            onClick={() => {
              onClose();
            }}
            className="underline h-10 leading-10 mx-4 cursor-pointer"
          >
            {" "}
            Cancel
          </span>
          <button
            type="submit"
            className="orange w-fit "
            onClick={async () => {
              let t = setTimeout(() => {
                alert("server is not responding");
                onClose();
              }, 3000);

              let s = await dischargePatient(
                user.username,
                user.password,
                patientId
              );
              //revoke the time out
              clearTimeout(t);
              if (s.status == "ok") onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </span>
    </div>
  );
}

export default DischargePatient;
