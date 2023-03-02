import React from "react";
import { getTreatments } from "../API";

function Treatments(props) {
  let $treatments = React.useState([]);
  React.useEffect(() => {
    getTreatments(props.patientId).then((treatments) => {
      $treatments[1](treatments);
    });
  }, []);
  if (!props.patientId) return;
  return (
    <div
      className="fixed inset-0 grid place-content-center 
    bg-slate-300 text-gray-700 px-6
    "
      style={{ display: props.patientId ? "grid" : "none" }}
    >
      <h1 className="ml-4">Treatments of patient {props.patientId}</h1>
      <span className="grid place-content-center gap-1 p-4 bg-slate-100  rounded-md shadow-xl mx-auto">
        <div className="grid grid-cols-7 gap-3 mb-2 mt-4">
          <h3 className="cell col-span-2">Name</h3>
          <h3 className="cell col-span-2">Drug</h3>
          <h3 className="cell col-span-3">Dosage</h3>
        </div>
        <div className="flex flex-col gap-3 whitespace-nowrap mb-8">
          {$treatments[0].map((treatment) => (
            <div className="grid grid-cols-7 gap-3" key={treatment.id}>
              <div className="cell col-span-2">{treatment.name}</div>
              <div className="cell col-span-2">{treatment.drug}</div>
              <div className="cell col-span-3">{treatment.dosage}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            props.onClose();
          }}
          className="red w-fit place-self-end"
        >
          close
        </button>
      </span>
    </div>
  );
}

export default Treatments;
