import React, { useEffect } from "react";

function SurePopup(props: any) {
  let { open, onNo, onYes } = props;
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  return (
    <div
      className="fixed inset-0 grid place-content-center 
    bg-slate-300 text-gray-700 px-6 overflow-y-auto
    "
      style={{ display: open ? "grid" : "none" }}
    >
      <span className="grid place-content-center gap-1 p-4 bg-slate-100  rounded-md shadow-xl mx-auto">
        <div className="col-span-2 flex flex-col gap-2 py-2 mb-2">
          <h1 className="mx-4">Are you Sure?</h1>
          <label className="text-gray-500 mt-2 text-center">
            {props.title}
          </label>
        </div>
        <div className="flex col-span-2 justify-end gap-4">
          <button
            onClick={() => {
              onNo();
            }}
            className="blue w-fit flex-1"
          >
            No
          </button>
          <button
            onClick={() => {
              onYes();
            }}
            className="orange w-fit flex-1 "
          >
            Yes
          </button>
        </div>
      </span>
    </div>
  );
}

export default SurePopup;
