export let SERVER_URL = "http://localhost:8000";
let my_alert = console.info;
export const login = async (username, password) => {
  return {
    status: "ok",
    username,
    password,
    type: username || "doctor",
    apikey: "6l4s91dg",
  };
};

// 1. Patient  registration/discharge
export const registerPatient = async (apikey, name) => {
  my_alert("API call: registerPatient(" + name + ")");
  //server registers a new patient and returns the id
  return { status: "ok", id: 1 };
  return { status: "invalid apikey" };
};
//and doctor  appointment/testscheduling–information  about  new patients need to be registered, appointments based on availability and priority should be scheduled, doctor  should  be  notified  about  the  appointments  in  a  dashboard.
export const scheduleAppointment = async (
  apikey,
  patientId,
  doctorId,
  datetime,
  priority,
  prescription
) => {
  my_alert(
    "API call: scheduleAppointment(" +
      patientId +
      "," +
      doctorId +
      "," +
      datetime +
      ", " +
      priority +
      ", " +
      prescription +
      ")"
  );
  //server
  return { status: "ok" };
  return { status: "not available" };
  return { status: "invalid apikey" };
};

export const scheduleTest = async (apikey, patientId, datetime, testId) => {
  my_alert(
    "API call: scheduleTest(" + patientId + "," + datetime + ", " + testId + ")"
  );
  return { status: "ok" };
  return { status: "invalid apikey" };
};

//For  admitted  patients  a  room should be assigned based on available room capacity.
//For discharged patients information should be preserved but room occupancy should be updated.
//The workflow should also support scheduling tests and treatments prescribed by doctors.

export const admitPatient = async (apikey, patientId) => {
  my_alert("API call: admitPatient(" + patientId + ")");
  //server admits an existing patient to a room and returns the room number
  return { status: "ok", room: 1 };
  return { status: "not available" };
  return { status: "invalid apikey" };
};

export const dischargePatient = async (apikey, patientId) => {
  my_alert("API call: dischargePatient(" + patientId + ")");
  return { status: "ok" };
  return { status: "invalid apikey" };
};

//(bonus point: using a calendar to schedule)
//2. Patient  data  entry –All the  health  information  of a  patient  including  test  results  and  treatments administered should be recorded.

//(bonus point: supporting storage and display of images e.g., x-ray)

//3. Doctor dashboard –all the records of the patients treated by a doctor should be displayed to her as a  dashboard.

export const getAppointments = async (apikey) => {
  my_alert("API call: getAppointments()");
  return {
    status: "ok",
    appointments: [
      {
        id: 1,
        patientId: 1,
        patientName: "Amitabh Bachchan",
        datetime: "2021-05-01 10:00:00",
        priority: 10,
        prescription: {
          treatments: [1],
          tests: [1, 2],
        },
      },
      {
        id: 2,
        patientId: 2,
        patientName: "David Beckham",
        datetime: "2021-05-02 10:00:00",
        priority: 5,
        prescription: {
          treatments: [1, 2],
          tests: [1],
        },
      },
    ],
  };
  return { status: "invalid apikey" };
};

// Doctor  may  also  query for  any patient  information.

export const getAllPatients = async (apikey) => {
  my_alert("API call: getAllPatients()");
  return {
    status: "ok",
    patients: [
      {
        id: 1,
        name: "Amitabh Bachchan",
      },
      {
        id: 2,
        name: "David Beckham",
      },
      {
        id: 3,
        name: "Daniel Craig",
      },
      {
        id: 4,
        name: "Tom Cruise",
      },
      {
        id: 5,
        name: "Tom Hanks",
      },
      {
        id: 6,
        name: "Tom Hardy",
      },
      {
        id: 7,
        name: "Tom Holland",
      },
      {
        id: 8,
        name: "Tommy Lee Jones",
      },
      {
        id: 9,
        name: "Tommy Wiseau",
      },
      {
        id: 10,
        name: "Tommy Lee",
      },
    ],
  };
};
//Doctor  should  be  able  to  record drugs/treatments prescribed to a patient.

export const getTreatments = async (apikey, patientId) => {
  my_alert("API call: getTreatments()");
  return [
    {
      id: 1,
      name: "end of all problems",
      drug: "heroine",
      dosage: "before dying",
    },
    {
      id: 2,
      name: "valentine's day",
      drug: "love",
      dosage: "take in little amounts",
    },
  ];
  return { status: "invalid apikey" };
};

export const getTests = async (apikey, patientId) => {
  my_alert("API call: getTests()");
  return [
    {
      id: 1,
      name: "the test that fails all the time",
      description: "this test is a joke",
      result: "failed",
    },
    {
      id: 2,
      name: "the test that passes all the time",
      description: "this test is a joke",
      result: "passed",
      report: new Blob(["this is a report"], { type: "text/plain" }),
    },
  ];
  return { status: "invalid apikey" };
};

//(bonus point: sending automated email reports to a doctor about the health information of patients treated by her on a weekly basis, high priority events may be emailed in an emergency manner)

//4. Database administration –should be able to add/delete new users
//(bonus point: implement data security policy with suitable access control)
export const getUsers = async (apikey) => {
  //wait for 1 second to simulate network latency
  my_alert("API call: getUsers()");
  return {
    status: "ok",
    users: [
      { id: 1, username: "admin1", type: "admin" },
      { id: 2, username: "admin2", type: "admin" },
      { id: 3, username: "Dr.Prakash", type: "doctor" },
      { id: 4, username: "Hritu", type: "frontdesk" },
      { id: 5, username: "Rajesh", type: "dataentry" },
      { id: 6, username: "Payel", type: "dataentry" },
    ],
  };
};
export const addUser = async (apikey, username, password, type) => {
  my_alert(
    "API call: addUser(" + username + ", " + password + ", " + type + ")"
  );
  return { status: "ok" };
};
export const deleteUser = async (apikey, id) => {
  my_alert("API call: deleteUser(" + id + ")");
  return { status: "ok" };
};
