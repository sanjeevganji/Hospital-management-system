import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  getAllPatientsForFrontDesk as fetchAllPatients,
  getUsers as fetchUsers,
  registerPatient,
  scheduleAppointment,
  fetchAdmissionHistory,
  fetchRescheduling,
} from "../API";
import ScheduleAppointmentPopUp from "../components/ScheduleAppointment";
import AdmitPatientPopUp from "../components/AdmitPatient";
import DischargePatientPopUp from "../components/DischargePatient";
import { getUser, tryLoggingOut } from "../log";
import './doctor.css'

function FrontDesk() {
  let [get1, set1] = React.useState(null);
  let [get2, set2] = React.useState(null);
  let [get3, set3] = React.useState(null);
  //get the user who is logged in
  let [user, setUser] = React.useState<any>(null);
  let [searchid, setSearchid] = React.useState(0);
  let [searchname, setSearchname] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState(0);
  const [selectedPanel, setSelectedPanel] = React.useState(0);
  let [history, setHistory] = React.useState<any>(null);
  let [reschedule, setReschedule] = React.useState<any>(null);



  useEffect(() => {
    getUser().then((user: any) => setUser(user));
  }, []);
  //fetch the users from the server
  let [fetchedPatients, setFetchedPatients] = React.useState<any>(null);

  useEffect(() => {
    if (user)
    {
      fetchAllPatients(user).then((res) => {
        setFetchedPatients(res);
      });
      fetchAdmissionHistory(user).then((res) => {
        setHistory(res);
      });
      fetchRescheduling(user).then((res) => {
        setReschedule(res);
      });
    }
  }, [user]);


  useEffect(() => {
    console.log({ fetchedPatients });
  }, [fetchedPatients]);


  function handleSearchId(e:any)
  {
    const id = parseInt(e.target.value);
    if(id < 0 || id.toString() == 'NaN')
    {
      // alert("can't be less than 0");
      setSearchid(0);
      return;
    }
    setSearchid(id);
  }
  function handleSearchName(e:any)
  {
    const name = (e.target.value);
    setSearchname(name);
  }

  function handlesubmitId()
  {
    setSearchid(0);
  }
  function handlesubmitName()
  {
    setSearchname("");
  }

  const handleOptionChange = (event: any) => {
    if (event.target.value === "Email") {
      setSelectedOption(1);
    } else {
      setSelectedOption(0);
    }
  }

  const handlePanelChange = (event: any) => {
        if (event.target.value === "Panel") {
          setSelectedPanel(0);
          // console.log("p");
          // console.log(selectedPanel)
        }
        else if(event.target.value === "Rescheduling"){
          setSelectedPanel(1);
          // console.log("r");
          // console.log(selectedPanel);
        }
        else if(event.target.value === "History"){
            setSelectedPanel(2);
            // console.log("h");
            // console.log(selectedPanel);
        }

  }

  return (
    <div className="px-6">
      <>
      <h2 className="mt-8 mb-2 shadow-lg ">Register Patient</h2>
      <form
        className="grid grid-cols-2 gap-x-3"
        onSubmit={async (e) => {
          if((e.target as any).name.value == "" && (e.target as any).Address.value == "")
          {
            e.preventDefault();
            alert("name and Address can't be null")
            return;
          }
          await registerPatient(
            user.username,
            user.password,
            (e.target as any).name.value,
            (e.target as any).Address.value,
            (e.target as any).contact.value,
            (e.target as any).email.value
          );
          fetchAllPatients(user).then((res) => {
            console.log("FETCHED", res);
            setFetchedPatients(res);
          });
        }}
      >
        <div className="col-span-2 flex flex-col gap-4 py-2 "></div>
        <input
          type="text"
          placeholder="patient name"
          name="name"
          autoComplete="off"
          className="col-span-1 flex flex-col gap-4 py-2 "
        />

        <input
          type="text"
          placeholder="Address"
          name="Address"
          autoComplete="off"
          className="col-span-1 flex flex-col gap-4 py-2 "
        />

        <div className="col-span-2 flex flex-col gap-4 py-2 "></div>

        <input
          type="text"
          placeholder="Email Address"
          name="email"
          autoComplete="off"
          className="col-span-1 flex flex-col gap-4 py-2 "
        />

        <input
          type="text"
          placeholder="Contact Details"
          name="contact"
          autoComplete="off"
          className="col-span-1 flex flex-col gap-4 py-2 "
        />

        <div className="col-span-2 flex flex-col gap-4 py-2 "></div>
        <button className="blue">Register Patient </button>
        <div className="col-span-2 flex flex-col gap-4 py-2 "></div>
      </form>

      <select
      className="mt-8 mb-2 shadow-lg font-bold"
      onChange={handlePanelChange}>
          <option value="Panel" className="">Control Panel</option>
          <option value="Rescheduling" className="">Rescheduling</option>
          <option value="History" className="">Admission History</option>
      </select>

      {
      selectedPanel == 2 &&
      (
        <>
        <div className="grid grid-cols-12 gap-3 mt-8 mb-2 shadow-lg text-center">
          <h2 className=" col-span-2">Appointment ID</h2>
          <h2 className=" col-span-1">Patient ID</h2>
          <h2 className=" col-span-3">Patient Name</h2>
          <h2 className=" col-span-2">Admit Date</h2>
          <h2 className=" col-span-2">Discharge Date</h2>
          <h2 className=" col-span-2">Room Number</h2>
        </div>
        <div className=" mb-16 mt-6 flex flex-col gap-3 text-center ">
          {history?.map((Admission: any) => (
            <div className="grid grid-cols-12 gap-3" key={Admission.appID}>
              <div className="card col-span-2 text-center ">{Admission.appID}</div>
              <div className="card col-span-1 text-center">{Admission.Patient}</div>
              <div className="card col-span-3">{Admission.Name}</div>
              <div className="card col-span-2">{Admission.Admit_date.slice(0,19).replace("T", " ")}</div>
              {Admission.Discharge_Date ?
              (<div className="card col-span-2">{Admission.Discharge_Date.slice(0,19).replace("T", " ")}</div>)
              :
              (<div className="card col-span-2">-</div>)
              }
              <div className="card col-span-2 text-center">{Admission.Room}</div>
            </div>
          ))}
        </div>
        </>
      )
      }
     {
      selectedPanel == 0 &&
      (<>
      <div className="search flex flex-wrap">
        <label className="id whitespace-nowrap"> Search by ID:
          <input className="input" type="number" value={searchid > 0 ? searchid : ""} onChange={handleSearchId}/>
          <button className="button" onClick={handlesubmitId}>clear</button>
        </label>
          <br />
        <label className="name whitespace-nowrap"> Search by Name:
          <input className="input" type="text" value={searchname} onChange={handleSearchName}/>
          <button className="button" onClick={handlesubmitName}>clear</button>
        </label>
      </div>

      <div className=" grid grid-cols-12 gap-3 mt-8 mb-2 shadow-lg text-center">
        <h2 className=" col-span-1">ID</h2>
        <h2 className=" col-span-2">Patient Name</h2>
        <h2 className=" col-span-3">Address</h2>
        <select className="col-span-2 font-bold" onChange={handleOptionChange}>
          <option value="Contact" className="font-bold" selected={selectedOption==0}>Contact</option>
          <option value="Email" className="font-bold" selected={selectedOption==1}>Email</option>
        </select>
        <h2 className=" col-span-1">Room</h2>
        <h2 className=" col-span-1">Type</h2>
        <h2 className=" col-span-2">Actions</h2>
      </div>
      <div className=" mb-16 mt-6 flex flex-col gap-3 ">
      {fetchedPatients?.map((fetchedPatient: any) => (
          ((searchid == 0 && searchname == "") || (searchid != 0 && fetchedPatient.ID.toString().startsWith(searchid.toString())) ||(searchname != "" && fetchedPatient.Name.toLowerCase().startsWith(searchname.toLowerCase()))) &&
          <div className="grid grid-cols-12 gap-3" key={fetchedPatient.ID}>
            <div className="card col-span-1 whitespace-nowrap">{fetchedPatient.ID}</div>
            <div className="card col-span-2 whitespace-nowrap">{fetchedPatient.Name}</div>
            <div className="card col-span-3 whitespace-nowrap">{fetchedPatient.Address}</div>
            { selectedOption === 1 ?
                (<div className="card col-span-2 whitespace-nowrap">{fetchedPatient.Email}</div>):
                (<div className="card col-span-2 whitespace-nowrap">{fetchedPatient.Contact}</div>)
            }
            {!fetchedPatient.admitted ? (
              <>
              <div className="card col-span-1 whitespace-nowrap">-</div>
              <div className="card col-span-1 whitespace-nowrap">-</div>
                <button
                  className="col-span-1 blue"
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
                    fetchAdmissionHistory(user).then((res) => {
                      setHistory(res);
                    });
                  }}
                />
              </>
            ) : (
              <>
                <div className="card col-span-1 whitespace-nowrap">{fetchedPatient.Room}</div>
                <div className="card col-span-1 whitespace-nowrap">{fetchedPatient.Type}</div>
                <button
                  className="col-span-1 red"
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
                  Name={fetchedPatient.Name}
                  Room={fetchedPatient.Room}
                  Type={fetchedPatient.Type}
                  open={fetchedPatient.ID === get2}
                  onClose={() => {
                    set2(null);
                    fetchAllPatients(user).then((res) => {
                      setFetchedPatients(res);
                    });
                    fetchAdmissionHistory(user).then((res) => {
                      setHistory(res);
                    });
                  }}
                />
              </>
            )}
            <button
              onClick={() => {
                set3(fetchedPatient.ID);
              }}
              className={"col-span-1 orange"}
            >
              appoint
            </button>
            <ScheduleAppointmentPopUp
              patientId={fetchedPatient.ID}
              appID={null}
              open={fetchedPatient.ID === get3}
              onClose={() => {
                set3(null);
                fetchAllPatients(user).then((res) => {
                  setFetchedPatients(res);
                });
              }}
              update={false}
            />
          </div>
        ))}
      </div>
      </>)
     }
     {
      selectedPanel == 1 &&
      (
        <>
      <div className=" grid grid-cols-12 gap-3 mt-8 mb-2 shadow-lg text-center">
        <h2 className=" col-span-1">ID</h2>
        <h2 className=" col-span-2">Patient Name</h2>
        <h2 className=" col-span-3">Address</h2>
        <select className="col-span-2 font-bold" onChange={handleOptionChange}>
          <option value="Contact" className="font-bold" selected={selectedOption==0} >Contact</option>
          <option value="Email" className="font-bold" selected={selectedOption==1}>Email</option>
        </select>
        <h2 className=" col-span-2">Past Date</h2>
        <h2 className=" col-span-2">Actions</h2>
      </div>
      <div className=" mb-16 mt-8 flex flex-col gap-3 ">
      {
        reschedule?.map((Appoinment: any) =>(
          <div className=" grid grid-cols-12 gap-3" key={Appoinment.appID}>
            <div className="card col-span-1 whitespace-nowrap">{Appoinment.ID}</div>
            <div className="card col-span-2 whitespace-nowrap">{Appoinment.Name}</div>
            <div className="card col-span-3 whitespace-nowrap">{Appoinment.Address}</div>
            {!selectedOption?
            (<div className="card col-span-2 whitespace-nowrap">{Appoinment.Contact}</div>)
            :
            (<div className="card col-span-2 whitespace-nowrap">{Appoinment.Email}</div>)
            }
            <div className="card col-span-2 whitespace-nowrap text-center">{Appoinment.appDate.slice(0,19).replace("T", ' ')}</div>
            <button
              onClick={() => {
                set3(Appoinment.ID);
              }}
              className={"col-span-2 orange"}
            >
              Reschedule
            </button>
            <ScheduleAppointmentPopUp
              patientId={Appoinment.ID}
              appID={Appoinment.appID}
              open={Appoinment.ID === get3}
              onClose={() => {
                set3(null);
                fetchRescheduling(user).then((res) => {
                  setReschedule(res);
                });
              }}
              update={true}
            />
          </div>
          )
        )
      }
      </div>
      </>
      )
      }
      </>
    </div>
  );
}

export default FrontDesk;
