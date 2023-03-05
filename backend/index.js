import express from "express";
import cors from "cors";
import mysql from "mysql2";
import isAuth from "./auth.js";
import { Blob } from "buffer";

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Hospital",
  password: "password",
  // host: "sql12.freemysqlhosting.net",
  // user: "sql12602698",
  // database: "sql12602698",
  // password: "1KhY5mYxNw",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

var app = express();
var PORT = 3000;
// use cors
app.use(cors());

//implement for specific clients

// const allowCrossDomain = (req, res, next) => {
//   res.header(`Access-Control-Allow-Origin`, `client.com`);
//   res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
//   res.header(`Access-Control-Allow-Headers`, `Content-Type`);
//   next();
// };

// For parsing application/json
app.use(express.json());

// onApp(app, connection, (onGET) => {
//   onGET("/", (onUserType, onQuery, params,res) => {
//     console.log("login request");
//     onUserType("admin", (id) => {
//       res.json({ status: "ok", data: { id: id, type: "admin" }})
//     });
//     onUserType("doctor", (id) => {
//       res.json({ status: "ok", data: { id: id, type: "doctor" }})
//     }
//     );
//     onUserType("frontend", (id) => {
//       res.json({ status: "ok", data: { id: id, type: "patient" }})
//     }
//     );
//     onUserType("dataentry", (id) => {
//       res.json({ status: "ok", data: { id: id, type: "patient" }})
//     }
//     );
//   });

//   onGET("/users", (onUserType, onQuery, params) => {
//     console.log("users");
//     onUserType("admin", (id) => {
//       onQuery("SELECT * FROM User;");
//     });
//   });

//   onGET("/appointments", (onUserType, onQuery, params) => {
//     onUserType("doctor", (id) => {
//       onQuery(`SELECT * from Appointments where doctorId=${id}`, (results) => {
//         let appointments = [
//           {
//             id: 1,
//             patientId: 1,
//             patientName: "Amitabh Bachchan",
//             datetime: "2021-05-01 10:00:00",
//             priority: 10,
//             prescription: {
//               treatments: [1],
//               tests: [1, 2],
//             },
//           },
//           {
//             id: 2,
//             patientId: 2,
//             patientName: "David Beckham",
//             datetime: "2021-05-02 10:00:00",
//             priority: 5,
//             prescription: {
//               treatments: [1, 2],
//               tests: [1],
//             },
//           },
//         ];
//         return appointments;
//       });
//     });
//   });

//   onGET("/patient/:number/treatments", (onUserType, onQuery, params) => {
//     onUserType("doctor", (id) => {
//       onQuery(`SELECT 1`, (results) => {
//         let patientId = params.number;
//         return [
//           {
//             id: 1,
//             name: "end of all problems",
//             drug: "heroine",
//             dosage: "before dying",
//           },
//           {
//             id: 2,
//             name: "valentine's day",
//             drug: "love",
//             dosage: "take in little amounts",
//           },
//         ];
//       });
//     });
//   });

//   onGET("/patient/:number/tests", (onUserType, onQuery, params) => {
//     onUserType("doctor", (id) => {
//       onQuery(`SELECT 1`, (results) => {
//         let tests = [
//           {
//             id: 1,
//             name: "Test 1",
//           },
//           {
//             id: 2,
//             name: "Test 2",
//           },
//         ];
//         return tests;
//       });
//     });
//   });
// });
console.log("hello");
app.get("/users", (req, res) => {
  isAuth(connection, req, res, (user) => {
    console.log("getting", user);
    if (user.Type == "admin") {
      let sql = `Select * from User;`;
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", data: err });
        }
        console.log("Users fetched");
        res.json({ status: "ok", data: result });
      });
      // res.json(user);
    }
  });
});

app.get("/", (req, res) => {
  isAuth(connection, req, res, (result) => {
    console.log({ login: result });
    res.json(result);
  });
});

app.get("/doctor/appointments", (req, res) => {
  console.log("getting appointments");
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "doctor") {
      let date = new Date().toJSON().slice(0, 10);
      let sql = `SELECT Appointment.ID, Patient.Name, Patient.ID FROM Appointment, Patient WHERE Doctor = '${user.Username}' AND Appointment.Patient = Patient.ID AND Appointment.Prescription = null and Appointment.Date = '${date}';`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          res.json({ status: "error", data: err });
        } else {
          res.json({ status: "ok", data: result });
        }
      });
    }
  });
});

app.post("/users", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "admin") {
      //sql query
      let sql = `INSERT INTO User (Username, Password, Type, Name) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.type}', '${req.body.name}');`;
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
        } else {
          res.json({ status: "ok" });
        }
      });
    }
  });
});

app.get("/doctor/patients", (req, res) => {
  console.log({ body: req.headers });
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "doctor") {
      let sql = `SELECT Patient.ID as ID, Name FROM Appointment, Patient WHERE Appointment.Doctor = '${user.username}' AND Appointment.Patient = Patient.ID GROUP BY Patient.ID`;
      console.log(sql);
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
        } else {
          console.log(result);
          res.json(result);
        }
      });
    }
  });
});

app.post("/users/delete", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "admin") {
      //sql query
      let sql = `DELETE FROM User WHERE Username='${req.body.username}';`;
      console.log(sql);
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
        } else {
          res.json({ status: "ok" });
        }
      });
    }
  });
});

app.get("/test/:id", (req, res) => {
  let id = req.params.id;
  //DUMMY TEST DATA
  // let test = {
  //   ID: id,
  //   Name: "Test 1",
  //   Date: "2021-05-01 10:00:00",
  //   Result: "Positive",
  //   Report:
  //     "x'89504E470D0A1A0A0000000D494844520000001000000010080200000090916836000000017352474200AECE1CE90000000467414D410000B18F0BFC6105000000097048597300000EC300000EC301C76FA8640000001E49444154384F6350DAE843126220493550F1A80662426C349406472801006AC91F1040F796BD0000000049454E44AE426082'",
  // };
  // res.json(test);

  // let report = new Blob(["Hello, world!"], { type: "text/plain" });
  // res.type(blob.type);
  // blob.arrayBuffer().then((buf) => {
  //   res.send(Buffer.from(buf));
  // });
  // res.json({ id });
  // isAuth(connection, req, res, (user) => {
  //   if (user.Type == "doctor") {
  //     // res.json({ user });
  //     let sql = `SELECT * FROM Test WHERE ID=${id}`;
  //     connection.query(sql, (err, result) => {
  //       if (err) {
  //         data = err;
  //         res.json(err);
  //       } else {
  //         res.json(result);
  //       }
  //     });
  //   } else {
  //     res.json({
  //       status: "error",
  //       message: "You must be a doctor to get this data",
  //     });
  //   }
  // });
});

app.post("/test", (req, res) => {
  isAuth(connection, req, res, (user) => {
    // res.json({ user });
    if (user.Type == "dataentry") {
      // res.json({ body: req.body });
      let { ID, Name, Date, Result, Report } = req.body;
      res.json({ ID, Name, Date, Result, Report });
      //sql query for inserting into test with report
      let sql;
      if (Report) {
        sql = `INSERT INTO Test (ID, Name, Date, Result, Report) VALUES (${ID}, '${Name}', '${Date}', '${Result}', '${Report}');`;
        //query
        connection.query(sql, (err, result) => {
          if (err) {
            res.json(err);
            console.log("sql error");
          } else {
            //sending
            res.json({ status: "ok", message: "Test added with report" });
          }
        });
      } else {
        sql = `INSERT INTO Test (ID, Name, Date, Result) VALUES (${ID}, '${Name}', '${Date}', '${Result}');`;
        //query
        connection.query(sql, (err, result) => {
          if (err) {
            res.json(err);
            console.log("sql error");
          } else {
            //sending
            res.json({ status: "ok", message: "Test added without report" });
          }
        });
      }
    } else {
      res.json({
        status: "error",
        message: "You must be a data entry person to add a test",
      });
    }
  });
});
app.post("/discharge", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "frontdesk") {
      //sql query
      let date = new Date().toJSON();
      let sql = `Select Admission.ID, Room from Admission, Patient_Admission WHERE Patient_Admission.ID = ${req.body.patientId} AND Admission.Discharge_date IS NULL;`;
      console.log(sql);
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
        } else if (result.length == 0) {
          res.json({ status: "error", message: "Patient is not admitted" });
        } else {
          sql = `UPDATE Admission SET Discharge_date = '${date}' WHERE ID = ${result[0].ID};`;
          let roomNumber = result[0].Room;
          console.log(sql);
          connection.query(sql, function (err, result) {
            if (err) {
              res.json(err);
              return;
            }
            sql = `UPDATE Room SET Beds_avail = Beds_avail + 1 WHERE Number = ${roomNumber};`;
            connection.query(sql, function (err, result) {
              if (err) {
                res.json(err);
                return;
              }
              res.json({ status: "ok" });
            });
          });
        }
      });
    }
  });
});

app.post("/register", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "frontdesk") {
      //sql query
      let sql = `INSERT INTO Patient (Name) VALUES ('${req.body.name}');`;
      console.log(sql);
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
        } else {
          res.json({ status: "ok", ID: result.insertId });
        }
      });
    }
  });
});

app.post("/admit", (req, res) => {
  isAuth(connection, req, res, (user) => {
    let date = new Date().toJSON();
    if (user.Type == "frontdesk") {
      //sql query
      let sql = `SELECT Number FROM Room WHERE Type = '${req.body.type}' ORDER BY Beds_avail LIMIT 1;`;
      connection.query(sql, function (err, result) {
        console.log({ result });
        if (err) {
          res.json({ status: "error", data: err });
          return;
        }
        if (result.length == 0 || result[0].Beds_avail == 0) {
          res.json({ status: "error", data: "No rooms available" });
          return;
        }
        let roomNumber = result[0].Number;
        sql = `INSERT INTO Admission (Patient, Room, Admit_date) VALUES ('${req.body.patientId}', ${roomNumber}, '${date}');`;
        console.log(sql);
        connection.query(sql, function (err, result) {
          if (err) {
            res.json({ status: "error", data: err });
            return;
          }
          let AdmitId = result.insertId;
          sql = `UPDATE Room SET Beds_avail = Beds_avail - 1 WHERE Number = ${roomNumber};`;
          connection.query(sql, function (err, result) {
            if (err) {
              res.json({ status: "error", data: err });
              return;
            }
            sql = `INSERT INTO Patient_Admission (ID, Admission) VALUES (${req.body.patientId}, ${AdmitId});`;
            connection.query(sql, function (err, result) {
              if (err) {
                res.json({ status: "error", data: err });
                return;
              }
              res.json({ status: "ok", Number: roomNumber, ID: AdmitId });
            });
          });
        });
      });
    }
  });
});

app.post("/schedule", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "frontdesk") {
      //sql query
      let sql = `(select Username from User where User.type="doctor" and User.Username not in (select Doctor from Appointment)) union (Select Doctor from Appointment where Date='${req.body.date}' group by Doctor order by count(*) limit 1)`;
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ err });
        } else {
          console.log({ result });
          let doctorApp = result[0].Username;
          sql = `INSERT INTO Appointment (Patient, Doctor, Date, Priority) VALUES ('${req.body.patientId}', '${doctorApp}', '${req.body.date}', '${req.body.priority}');`;
          console.log({ schedule: sql });
          connection.query(sql, function (err, result) {
            if (err) {
              res.json({ status: "error" });
            } else {
              let AppId = result.insertId;
              sql = `INSERT INTO Patient_Appointment (ID, Appointment) VALUES (${req.body.patientId}, ${AppId});`;
              connection.query(sql, function (err, result) {
                if (err) {
                  res.json({ status: "error" });
                } else {
                  res.json({ status: "ok", AppId: AppId });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on http://localhost:" + PORT);
});
