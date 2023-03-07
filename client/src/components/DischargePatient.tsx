import React, { useEffect, useState } from "react";
import { getTreatments, scheduleAppointment } from "../API";
import { getUser } from "../log";

function DischargePatient(props: any) {
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
    bg-black text-gray-700 px-6 bg-opacity-30
    "
      style={{ display: open ? "grid" : "none" }}
    >
      <h1 className="ml-4">Discharge Patient {patientId}</h1>
      <span className="grid place-content-center gap-1 p-4 bg-slate-100  rounded-md shadow-xl mx-auto">
        <div className="grid grid-cols-7 gap-3 mb-2 mt-4">
          <h3 className="cell col-span-2">Name</h3>
          <h3 className="cell col-span-2">Drug</h3>
          <h3 className="cell col-span-3">Dosage</h3>
        </div>
        <div className="flex flex-col gap-3 whitespace-nowrap mb-8">
          {/* {$treatments[0].map((treatment) => (
            <div className="grid grid-cols-7 gap-3" key={treatment.id}>
              <div className="cell col-span-2">{treatment.name}</div>
              <div className="cell col-span-2">{treatment.drug}</div>
              <div className="cell col-span-3">{treatment.dosage}</div>
            </div>
          ))} */}
        </div>
        <button
          type="submit"
          className=" col-span-2 orange w-fit place-self-end"
        >
          Admit
        </button>
      </span>
    </div>
  );
}

export default DischargePatient;
