import React from "react";

function DataEntry() {
  return (
    <>
      <div>user:{JSON.stringify(props.$user[0])}</div>
      <div className="bg-slate-300 text-gray-700">Admin</div>
    </>
  );
}

export default DataEntry;
