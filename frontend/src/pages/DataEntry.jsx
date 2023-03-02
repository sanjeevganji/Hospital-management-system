import React from "react";

function DataEntry(props) {
  return (
    <>
      <div className="fixed inset-0 bg-slate-200 text-gray-700 overflow-y-scroll px-6">
        {/* <div>Admin : {props.$user[0].apikey}</div> */}

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
        </div>
      </div>
    </>
  );
}

export default DataEntry;
