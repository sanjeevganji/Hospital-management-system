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
  if (err) {
    console.log("connect error");
  }
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

console.log("hello");

// on SUBMIT

app.get("/", (req, res) => {
  isAuth(connection, req, res, (result) => {
    console.log({ login: result });
    res.json(result);
  });
});

// ADMIN

// getting user data

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

// admin-uesr

app.post("/users", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "admin") {
      //sql query
      let sql = `INSERT INTO User (Username, Password, Type, Name) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.type}', '${req.body.name}');`;
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "username must be unique" });
        } else {
          res.json({ status: "ok" });
        }
      });
    }
  });
});

// admin-delete

app.post("/users/delete", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "admin") {
      //sql query
      let sql = `DELETE FROM User WHERE Username='${req.body.username}' AND Type NOT IN ("admin");`;
      console.log(sql);
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({
            status: "error",
            reason: "deleting user is not possible",
          });
        } else {
          let sql2 = `SELECT Type FROM User WHERE Username='${req.body.username}'`;
          connection.query(sql2, function (err, result) {
            if (err) {
              res.json({
                status: "error",
                reason: "username might not be present ",
              });
            } else if (result[0] && result[0].Type == "admin") {
              res.json({
                status: "warning",
                reason: "unauthorized: can't delete admin",
              });
            } else res.json({ status: "ok" });
          });
        }
      });
    }
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
          console.log("124result" + result);
          res.json({ status: "ok", data: result });
        }
      });
    }
  });
});
//TODO;
app.get("/frontdesk/patients", (req, res) => {
  console.log({ body: req.headers });
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "frontdesk") {
      //todo: change the query to get if patient is in Admission and Discharge Date is > current date
      let sql = `SELECT Patient.*,
          CASE WHEN Admission.ID IS NOT NULL AND Admission.Discharge_date IS NULL
            THEN true
            ELSE false
          END AS admitted
        FROM Patient
        LEFT JOIN Admission ON Patient.ID = Admission.Patient
        ORDER BY Patient.ID DESC;
      `;
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

//not tested
app.get("/test/:id", (req, res) => {
  let id = req.params.id;
  // DUMMY TEST DATA
  let test = {
    ID: id,
    Name: "Test 1",
    Date: "2021-05-01 10:00:00",
    Result: "Positive",
    Report:
      "x'89504E470D0A1A0A0000000D494844520000001000000010080200000090916836000000017352474200AECE1CE90000000467414D410000B18F0BFC6105000000097048597300000EC300000EC301C76FA8640000001E49444154384F6350DAE843126220493550F1A80662426C349406472801006AC91F1040F796BD0000000049454E44AE426082'",
  };
  res.json(test);

  let report = new Blob(["Hello, world!"], { type: "text/plain" });
  res.type(blob.type);
  blob.arrayBuffer().then((buf) => {
    res.send(Buffer.from(buf));
  });
  res.json({ id });
  isAuth(connection, req, res, (user) => {
    if (user.Type == "doctor") {
      // res.json({ user });
      let sql = `SELECT * FROM Test WHERE ID=${id}`;
      connection.query(sql, (err, result) => {
        if (err) {
          data = err;
          res.json(err);
        } else {
          res.json(result);
        }
      });
    } else {
      res.json({
        status: "error",
        message: "You must be a doctor to get this data",
      });
    }
  });
});
//not tested
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
    let date = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log({ date });
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

app.post("/appointment/schedule", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "frontdesk") {
      //sql query
      let sql = `(select Username from User where User.Type="doctor" and User.Username not in (select Doctor from Appointment where Date='${req.body.date}') limit 1) union (Select Doctor from Appointment where Date='${req.body.date}' group by Doctor order by count(*) limit 1);`;
      console.log({ sql });
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
app.post("/test/schedule", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "dataentry") {
      console.log({ body: req.body });
      //sql query
      let sql = `insert into Test (Name,Date) values("${req.body.testName}","${req.body.date}");`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "test" });
        } else {
          console.log({ result });
          let insertId = result.insertId;
          sql = `INSERT INTO Prescription_Test (ID, Test, Important) VALUES ('${req.body.prescriptionId}', '${insertId}', '${req.body.important}');`;
          console.log({ insert_test: sql });
          connection.query(sql, function (err, result) {
            if (err) {
              res.json({ status: "error", reason: "prescription" });
            } else {
              res.json({ status: "ok", TestId: insertId });
            }
          });
        }
      });
    }
  });
});

app.post("/treatment", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "dataentry") {
      console.log({ body: req.body });
      //sql query
      let sql = `insert into Treatment (Date, Name, Dosage) values("${req.body.date}","${req.body.treatmentName}", "${req.body.dosage}");`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "treatment" });
        } else {
          console.log({ result });
          let insertId = result.insertId;
          console.log({ insertId });
          sql = `INSERT INTO Prescription_Treatment (ID, Treatment) VALUES ('${req.body.prescriptionId}', '${insertId}');`;
          console.log({ insert_treatment: sql });
          connection.query(sql, function (err, result) {
            if (err) {
              res.json({ status: "error", reason: "prescription" });
            } else {
              res.json({ status: "ok", TestId: insertId });
            }
          });
        }
      });
    }
  });
});

app.post("/prescription", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "dataentry") {
      console.log({ body: req.body });
      //sql query
      let sql = `insert into Prescription () values();`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "treatment" });
        } else {
          console.log({ result });
          let insertId = result.insertId;
          console.log({ insertId });
          sql = `UPDATE Appointment SET Prescription = '${insertId}' WHERE ID = '${req.body.appointmentId}';`;
          console.log({ update_appointment: sql });
          connection.query(sql, function (err, result) {
            if (err) {
              res.json({ status: "error", reason: "update_appoinement" });
            } else {
              res.json({ status: "ok", TestId: insertId });
            }
          });
        }
      });
    }
  });
});

app.post("/getTreatment", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "doctor") {
      console.log({ body: req.body });
      //sql query
      let sql = `select Appointment.ID , Treatment.ID , Treatment.Name, Treatment.Dosage, Treatment.Date from Treatment, Prescription_Treatment, Appointment where Appointment.Patient = "${req.body.patientId}" and Appointment.Prescription = Prescription_Treatment.ID and Appointment.Date = Treatment.Date and Prescription_Treatment.Treatment = Treatment.ID;`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "getTreatment" });
        } else {
          console.log({ result });
          let insertId = result.insertId;
          res.json({ status: "ok", TestId: insertId });
        }
      });
    }
  });
});

app.post("/getTest", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "doctor") {
      console.log({ body: req.body });
      //sql query
      let sql = `select Appointment.ID , Test.ID , Test.Name,  Test.Date, Test.Result, Test.Report from Test, Prescription_Test, Appointment where Appointment.Patient = "${req.body.patientId}" and Appointment.Prescription = Prescription_Test.ID and Appointment.Date = Test.Date and Prescription_Test.Test = Test.ID;`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "getTest" });
        } else {
          console.log({ result });
          let insertId = result.insertId;
          res.json({ status: "ok", result });
        }
      });
    }
  });
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on http://localhost:" + PORT);
});
