import express from "express";
import cors from "cors";
import moment from "moment";
import mysql from "mysql2";
import isAuth from "./auth.js";
import mailDoc from "./Nodemailer.js";
import fs from "fs";

const formatDate = (date) => {
  let d = moment(date);
  return d.format("YYYY-MM-DD");
};

var connection = mysql.createConnection({
  // host: "localhost",
  // user: "root",
  // database: "Hospital",
  // password: "password",
  // host: "dbms-hostpital.mysql.database.azure.com",
  // user: "atishay",
  // password: "pass@123",
  // database: "hospital",
  // port: 3306,
  // ssl: { cs: fs.readFileSync("./files/BaltimoreCyberTrustRoot.crt.pem") },
  // host: "localhost",
  // user: "root",
  // database: "Hospital",
  // password: "password",
  host: "localhost",
  user: "root",
  database: "Hospital",
  password: "DakRR#2020",
  // host: "sql12.freemysqlhosting.net",t
  // user: "sql12602698",
  // database: "sql12602698",
  // password: "1KhY5mYxNw",
});

connection.connect(function (err) {
  if (err) {
    console.log({ connection });
    console.log({ err });
    return;
  }
  console.log("Connected to database!");
});

let awaitQUERY = async (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results, fields) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
var app = express();
var PORT = 3000;
// use cors
app.use(cors());

//json limit 20mb
app.use(express.json({ limit: "20mb" }));

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
  console.log(`app.get("/users"...`);
  isAuth(connection, req, res, (user) => {
    if (user.Type == "admin") {
      let sql = `Select * from User WHERE Active;`;
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", data: err });
        }
        res.json({ status: "ok", data: result });
      });
    }
  });
});

// admin-uesr

app.post("/users", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "admin") {
      //sql query
      let sql = `INSERT INTO User (Username, Password, Type, Name, Email) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.type}', '${req.body.name}', '${req.body.email}');`;
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
  console.log(`app.get("/users/delete"...`);
  isAuth(connection, req, res, async (user) => {
    if (user.Type == "admin") {
      //get the info of the user to be deleted
      let sql = `SELECT * FROM User WHERE Username = '${req.body.username}';`;
      let userToDelete = (await awaitQUERY(sql))[0];
      console.log({ userToDelete });
      if (userToDelete.Type == "admin") {
        res.json({ status: "error", reason: "cannot delete admin" });
        return;
      }
      let update = await awaitQUERY(
        `UPDATE User SET Active=0 where Username="${userToDelete.Username}"`
      );
      console.log({ update });
      if (userToDelete.Type == "doctor") {
        let date = formatDate(new Date());
        let sql = `SELECT Appointment.ID AS appID, Patient.ID AS pID, Patient.Name AS pName, Appointment.Date AS date, Appointment.Priority AS priority, Patient.Contact AS Contact, Patient.Email AS Email FROM Appointment, Patient WHERE Appointment.Doctor = '${userToDelete.Username}' AND Appointment.Patient = Patient.ID AND Appointment.Prescription is NULL AND Appointment.Date >= '${date}';`;
        console.log({ sql });
        let appointments = await awaitQUERY(sql);
        console.log({ appointments });
        for (let i = 0; i < appointments.length; i++) {
          const appointment = appointments[i];
          let fdate = formatDate(appointment.date);
          let sqlToReassign = `SELECT Username FROM User
                    LEFT JOIN Appointment ON User.Username = Appointment.Doctor AND Appointment.Prescription IS NULL AND Appointment.Date >= CURDATE()
                    WHERE User.Type = 'doctor' AND Active
                    GROUP BY Username
                    ORDER BY COUNT(Username);`;
          console.log({ sqlToReassign });
          let freeDoctors = await awaitQUERY(sqlToReassign);
          console.log({ doctor: freeDoctors });
          if (freeDoctors.length == 0) {
            await awaitQUERY(
              `UPDATE User SET Active=1 where Username="${userToDelete.Username}"`
            );
            res.json({ status: "error", reason: "no doctors available" });
            return;
          }
          let doctorApp = freeDoctors[0].Username;
          sql = `UPDATE Appointment SET Doctor='${doctorApp}' WHERE ID='${appointment.appID}';`;
          await awaitQUERY(sql);
        }
      }
      res.json({ status: "ok" });
    }
  });
});

app.get("/doctor/appointments", (req, res) => {
  console.log("getting appointments");
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "doctor") {
      //CORRECT THIS
      let sql = `SELECT Appointment.ID AS appID, Patient.ID AS pID, Patient.Name AS pName, Appointment.Date AS date, Appointment.Priority AS priority, Patient.Contact AS Contact, Patient.Email AS Email
               FROM Appointment, Patient WHERE Appointment.Doctor = '${user.Username}' AND Appointment.Patient = Patient.ID AND Appointment.Prescription is NULL AND Appointment.Date >= CURDATE();`;

      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          res.json({ status: "error", data: err });
        } else {
          console.log(result);
          res.json({ status: "ok", data: result });
        }
      });
    }
  });
});

app.get("/frontdesk/patients", (req, res) => {
  console.log({ body: req.headers });
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "frontdesk") {
      let sql = `SELECT Patient.*, Admission.Room AS Room, Room.Type AS Type,
          CASE WHEN Admission.ID IS NOT NULL AND Admission.Discharge_date IS NULL
            THEN true
            ELSE false
          END AS admitted
	      FROM Patient
	      LEFT JOIN Admission ON Patient.ID = Admission.Patient AND Admission.Discharge_date IS NULL
        LEFT JOIN Room ON Room.Number = Admission.Room
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

app.get("/dataentry/appointments/noprescription", (req, res) => {
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "dataentry") {
      let sql = `SELECT Appointment.ID as appID, Patient.ID as pID, Patient.Name as pName, Appointment.Doctor as dName, Date as date FROM Appointment, Patient WHERE Prescription IS NULL AND Patient=Patient.ID AND Appointment.Date <= CURDATE();`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          console.log({ noPresSQL: err });
          res.json({ status: "error" });
        } else {
          console.log({ result });
          res.json(result);
        }
      });
    }
  });
});

app.get("/dataentry/test/update", (req, res) => {
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "dataentry") {
      let sql = `SELECT * FROM Test WHERE Result IS NULL AND Date <= CURDATE();`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          console.log({ err });
          res.json({ status: "error" });
        } else {
          console.log({ result });
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
      let sql = `SELECT DISTINCT Patient.ID as ID, Patient.Name AS Name, Patient.Address AS Address,Patient.Contact AS Contact, Patient.Email AS Email
               FROM Appointment, Patient WHERE Appointment.Doctor = '${user.Username}' AND Appointment.Patient = Patient.ID`;
      console.log(sql);
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
        } else {
          console.log(result);

          let dummy = [
            {
              ID: 1,
              Name: "Saras",
            },
            {
              ID: 2,
              Name: "Saras",
            },
          ];
          res.json(result);
        }
      });
    }
  });
});

app.get("/getAdmissionHistory", (req, res) => {
  console.log({ body: req.headers });
  isAuth(connection, req, res, (user) => {
    console.log({ user });
    if (user.Type == "frontdesk") {
      let sql = `SELECT Admission.ID AS appID, Admission.Room AS Room,Admission.Admit_date As Admit_date, Admission.Discharge_date AS Discharge_Date,
              Patient.Name AS Name, Patient.ID AS Patient
              FROM Admission
              JOIN Patient ON Admission.Patient = Patient.ID
              ORDER BY Admission.ID DESC LIMIT 100;`;
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

app.get("/getRescheduling", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "frontdesk") {
      let sql = `SELECT Patient.*, Appointment.Date AS appDate, Appointment.ID AS appID
      FROM Patient, Appointment
      WHERE Patient.ID = Appointment.Patient AND CURDATE() >= Appointment.Date AND Appointment.Prescription IS NULL;
      `;
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


app.get("/getScheduleTest", (req, res) => {
    isAuth(connection, req, res, (user) => {
        if (user.Type == "frontdesk") {
            let sql = `SELECT Patient.*, Test.ID AS testID, Test.Name AS testName
      FROM Patient, Appointment, Prescription AS P, Prescription_Test AS T, Test
      WHERE Patient.ID = Appointment.Patient AND Appointment.Prescription = P.ID AND P.ID = T.ID AND T.Test = Test.ID AND Test.Date IS NULL;
      `;
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

app.get("/getRescheduleTest", (req, res) => {
    isAuth(connection, req, res, (user) => {
        if (user.Type == "frontdesk") {
            let sql = `SELECT Patient.*, Test.ID AS testID, Test.Name AS testName, Test.Date AS Date
      FROM Patient, Appointment, Prescription AS P, Prescription_Test AS T, Test
      WHERE Patient.ID = Appointment.Patient AND Appointment.Prescription = P.ID AND P.ID = T.ID AND T.Test = Test.ID AND CURDATE() > Test.Date AND Test.Result IS NULL;
      `;
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
// app.get("/test/:id", (req, res) => {
//   let id = req.params.id;
//   // DUMMY TEST DATA
//   let test = {
//     ID: id,
//     Name: "Test 1",
//     Date: "2021-05-01 10:00:00",
//     Result: "Positive",
//     Report:
//       "x'89504E470D0A1A0A0000000D494844520000001000000010080200000090916836000000017352474200AECE1CE90000000467414D410000B18F0BFC6105000000097048597300000EC300000EC301C76FA8640000001E49444154384F6350DAE843126220493550F1A80662426C349406472801006AC91F1040F796BD0000000049454E44AE426082'",
//   };
//   res.json(test);

//   let report = new Blob(["Hello, world!"], { type: "text/plain" });
//   res.type(blob.type);
//   blob.arrayBuffer().then((buf) => {
//     res.send(Buffer.from(buf));
//   });
//   res.json({ id });
//   isAuth(connection, req, res, (user) => {
//     if (user.Type == "doctor") {
//       // res.json({ user });
//       let sql = `SELECT * FROM Test WHERE ID=${id}`;
//       connection.query(sql, (err, result) => {
//         if (err) {
//           data = err;
//           res.json(err);
//         } else {
//           res.json(result);
//         }
//       });
//     } else {
//       res.json({
//         status: "error",
//         message: "You must be a doctor to get this data",
//       });
//     }
//   });
// });
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
      let date = formatDate(new Date());
      let sql = `Select Admission.ID, Admission.Room AS Room from Admission WHERE Admission.Patient = ${req.body.patientId} AND Admission.Discharge_date IS NULL;`;
      console.log(sql);
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
        } else if (result.length == 0) {
          res.json({ status: "error", message: "Patient is not admitted" });
        } else {
          sql = `UPDATE Admission SET Discharge_date = '${date.slice(
            0,
            10
          )}' WHERE ID = ${result[0].ID};`;
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
      let sql = `INSERT INTO Patient (Name, Address, Contact, Email) VALUES ('${req.body.name}', '${req.body.Address}', '${req.body.contact}', '${req.body.email}');`;
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

//TODO: add report BODY to test
app.post("/dataentry/appointments", (req, res) => {
  console.log("dataentry/appointments");
  isAuth(connection, req, res, (user) => {
    if (user.Type == "dataentry") {
      //sql query
      let tests = req.body.tests;
      let treatments = req.body.treatments;
      console.log({ treatments });
      let sql = ``;
      if (tests.length > 0) {
        sql = `INSERT INTO Test (Name, Date, Result, Report, Image) VALUES `;
        var imps = tests.map((test, i) => {
          if (test.reportBody) {
            let rb = test.reportBody;
            console.log(
              JSON.stringify(
                `('${test.name}', '${test.date}', '${
                  test.result
                }', x'${rb.slice(0, 50)}...'), `
              )
            );
            test.imageBody
              ? (sql += `('${test.name}', '${test.date}', '${test.result}', x'${rb}', x'${test.imageBody}'), `)
              : (sql += `('${test.name}', '${test.date}', '${
                  test.result
                }', x'${rb}', ${null} ), `);
          } else {
            test.imageBody
              ? (sql += `('${test.name}', '${test.date}', '${
                  test.result
                }', ${null},  ${null}), `)
              : (sql += `('${test.name}', '${test.date}', '${
                  test.result
                }', x'${rb}', ${null} ), `);
          }
          return test.important || 0;
        });
        sql = sql.slice(0, -2);
        sql += ";";
      } else {
        sql = `SELECT 0;`;
      }
      // console.log({ sql });
      // console.log({ imps });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
          console.log(err);
          return;
        }
        let testIds = result.insertId;
        let testNo = result.affectedRows;
        if (treatments.length > 0) {
          sql = `INSERT INTO Treatment (Date, Name, Dosage) VALUES `;
          treatments.forEach((treatment) => {
            sql += `('${treatment.date}', '${treatment.name}', '${treatment.dosage}'), `;
          });
          sql = sql.slice(0, -2);
          sql += ";";
        } else {
          sql = `SELECT 0;`;
        }

        console.log({ sql });
        connection.query(sql, function (err, result) {
          if (err) {
            res.json({ status: "error" });
            console.log({ err });
            return;
          }
          let treatmentIds = result.insertId;
          let treatmentNo = result.affectedRows;
          sql = `INSERT INTO Prescription VALUES ();`;
          connection.query(sql, function (err, result) {
            if (err) {
              res.json({ status: "error" });
              return;
            }
            let prescriptionId = result.insertId;
            if (tests.length > 0) {
              sql = `INSERT INTO Prescription_Test VALUES `;
              let i = 0;
              imps.forEach((imp) => {
                sql += `(${prescriptionId}, ${testIds + i}, ${imp}), `;
                i += 1;
              });
              sql = sql.slice(0, -2);
              sql += ";";
            } else {
              sql = `SELECT 0;`;
            }
            console.log({ sql });
            connection.query(sql, function (err, result) {
              if (err) {
                res.json({ status: "error" });
                return;
              }
              if (treatments.length > 0) {
                sql = `INSERT INTO Prescription_Treatment VALUES `;
                for (i = 0; i < treatmentNo; i++) {
                  sql += `(${prescriptionId}, ${treatmentIds + i}), `;
                }
                sql = sql.slice(0, -2);
                sql += ";";
              } else {
                sql = `SELECT 0;`;
              }
              console.log({ sql });
              connection.query(sql, function (err, result) {
                if (err) {
                  res.json({ status: "error" });
                  return;
                }
                sql = `UPDATE Appointment SET Prescription = ${prescriptionId} WHERE ID = ${req.body.appID};`;
                console.log({ sql });
                connection.query(sql, function (err, result) {
                  if (err) {
                    res.json({ status: "error" });
                    return;
                  }
                  console.log({ result });
                  let imptests = tests.filter((test) => test.important == "1");
                  if (imptests.length > 0) {
                    sql = `SELECT User.Name as dName,Patient.Name as pName, Appointment.Patient as pID, User.Email FROM Appointment, User, Patient WHERE Appointment.ID = ${req.body.appID} AND User.Username = Appointment.Doctor AND Patient.ID = Appointment.Patient;`;
                    console.log({ sql });
                    connection.query(sql, function (err, result) {
                      console.log(sql);
                      if (err) {
                        console.log({ err });
                        res.json({ stats: "error" });
                        return;
                      }
                      console.log({ result });
                      mailDoc({
                        email: result[0].Email,
                        patient: result[0].pID,
                        pName: result[0].pName,
                        name: result[0].dName,
                        test: imptests,
                      });
                    });
                  }
                  res.json({ status: "ok", data: { prescriptionId } });
                });
              });
            });
          });
        });
      });
    }
  });
});
/**
 * it takes the appID , tests(names,important) and treatments
 * fills in all the tables
 * it will return the prescription attached to the given appointment
 * STATUS:DONE AND WORKING
 */
app.post("/dataentry/prescription", (req, res) => {
  console.log("POST:/dataentry/prescription");
  isAuth(connection, req, res, async (user) => {
    if (user.Type == "dataentry") {
      //sql query
      let tests = req.body.tests; //{name,important}
      console.log({ tests });
      let imps = tests.map((test) => test.important || 0);
      let treatments = req.body.treatments;
      console.log({ treatments });
      let sql = ``;
      if (tests.length > 0) {
        sql = `INSERT INTO Test (Name) VALUES `;
        tests.forEach((test) => {
          sql += `('${test.name}'), `;
        });
        sql = sql.slice(0, -2);
        sql += ";";
      } else {
        sql = `SELECT 0;`;
      }
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error" });
          console.log(err);
          return;
        }
        let testIds = result.insertId;
        console.log({ testIds });
        let testNo = result.affectedRows;
        if (treatments.length > 0) {
          sql = `INSERT INTO Treatment (Date, Name, Dosage) VALUES `;
          treatments.forEach((treatment) => {
            sql += `('${treatment.date}', '${treatment.name}', '${treatment.dosage}'), `;
          });
          sql = sql.slice(0, -2);
          sql += ";";
        } else {
          sql = `SELECT 0;`;
        }
        console.log({ TreatmentSQL: sql });
        connection.query(sql, function (err, result) {
          if (err) {
            res.json({ status: "error" });
            console.log({ err });
            return;
          }
          let treatmentIds = result.insertId;
          console.log({ treatmentIds });
          let treatmentNo = result.affectedRows;
          sql = `INSERT INTO Prescription VALUES ();`;
          connection.query(sql, function (err, result) {
            if (err) {
              res.json({ status: "error" });
              return;
            }
            let prescriptionId = result.insertId;
            if (tests.length > 0) {
              sql = `INSERT INTO Prescription_Test VALUES `;
              let i = 0;
              imps.forEach((imp) => {
                sql += `(${prescriptionId}, ${testIds + i}, ${imp}), `;
                i += 1;
              });
              sql = sql.slice(0, -2);
              sql += ";";
            } else {
              sql = `SELECT 0;`;
            }
            console.log({ sql });
            connection.query(sql, function (err, result) {
              if (err) {
                res.json({ status: "error" });
                return;
              }
              if (treatments.length > 0) {
                sql = `INSERT INTO Prescription_Treatment VALUES `;
                for (let i = 0; i < treatmentNo; i++) {
                  sql += `(${prescriptionId}, ${treatmentIds + i}), `;
                }
                sql = sql.slice(0, -2);
                sql += ";";
              } else {
                sql = `SELECT 0;`;
              }
              console.log({ sql });
              //INSERT INTO Prescription_Treatment
              connection.query(sql, function (err, result) {
                if (err) {
                  res.json({ status: "error" });
                  return;
                }
                sql = `UPDATE Appointment SET Prescription = ${prescriptionId} WHERE ID = ${req.body.appID};`;
                console.log({ sql });
                connection.query(sql, function (err, result) {
                  if (err) {
                    res.json({ status: "error" });
                    return;
                  }
                  //DONE
                  res.json({ status: "ok", data: { prescriptionId } });
                });
              });
            });
          });
        });
      });
    }
  });
});

/**
 * takes an testID with date checks if the date < today
 * if yes then it will update the test result and report
 * if the test is important then it will send a mail to the doctor
 */
app.post("/dataentry/testresult", (req, res) => {
  console.log("POST:/dataentry/testresult");
  isAuth(connection, req, res, async (user) => {
    if (user.Type == "dataentry") {
      //sql query

      let result = req.body.result;
      //PRELIMINARY CHECKS for result
      {
        //check if result is "negative" or "positive"
        if (result != "negative" && result != "positive") {
          res.json({ status: "error" });
          return;
        }
        let report = req.body.report;
        //check report is  of string type
        if (typeof report != "string") {
          res.json({
            status: "error",
            reason: "report not in hexstring format",
          });
          return;
        }
        if (report.length == 0) {
          report = "null";
        }
        let image = req.body.image;
        //check image is of string type
        if (typeof image != "string") {
          res.json({
            status: "error",
            reason: "image not in hexstring format",
          });
          return;
        }
        if (image.length == 0) {
          image = "null";
        }
      }

      let sql = `UPDATE Test SET Result = '${req.body.result}', Report = '${req.body.report}', Image = '${req.body.image}' WHERE ID = ${req.body.ID};`;
      connection.query(sql, function (err, result) {
        if (err) {
          console.error("sql UPDATE Test SET", err);
          res.json({ status: "error" });
          return;
        }
        console.info("sql UPDATE Test SET", result);
        sql = `SELECT ID,Important FROM Prescription_Test WHERE Test = ${req.body.ID};`;
        console.log({ sql });
        connection.query(sql, function (err, result) {
          if (err) {
            console.error("sql SELECT ID ", err);
            res.json({ status: "error" });
            return;
          }
          console.info("sql SELECT ID ", result);
          if (result[0].Important == 1) {
            let Prescription = result[0].ID;
            sql = `SELECT User.Name as dName,Patient.Name as pName, Appointment.Patient as pID, User.Email from Appointment,Patient,User WHERE Prescription = ${Prescription} AND Doctor=Username AND Patient.ID=Appointment.Patient;`;
            connection.query(sql, function (err, result) {
              if (err) {
                console.error("sql SELECT Email ", err);
                res.json({ status: "error" });
                return;
              }
              console.log("SELECT Email", { result });
              //get the whole test
              sql = `select * from Test where ID=${req.body.ID}`;
              connection.query(sql, function (err, test) {
                if (err) {
                  console.error("sql select * from Test  ", err);
                  res.json({ status: "error" });
                  return;
                }
                console.log("select * from result ", result[0]);
                console.log("select * from Test ", test[0]);
                mailDoc({
                  email: result[0].Email,
                  patient: result[0].pID,
                  pName: result[0].pName,
                  name: result[0].dName,
                  test: test,
                });
                res.json({ status: "ok" });
              });
            });
          } else {
            res.json({ status: "ok" });
          }
        });
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
      let sql = `SELECT Username FROM User
                    LEFT JOIN Appointment ON User.Username = Appointment.Doctor AND Appointment.Prescription IS NULL AND Appointment.Date >= CURDATE()
                    WHERE User.Type = 'doctor' AND Active
                    GROUP BY Username
                    ORDER BY COUNT(Username);`;
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
// app.post("/test/schedule", (req, res) => {
//   isAuth(connection, req, res, (user) => {
//     if (user.Type == "dataentry") {
//       console.log({ body: req.body });
//       //sql query
//       let sql = `insert into Test (Name,Date) values("${req.body.testName}","${req.body.date}");`;
//       console.log({ sql });
//       connection.query(sql, function (err, result) {
//         if (err) {
//           res.json({ status: "error", reason: "test" });
//         } else {GET
//           console.log({ result });
//           let insertId = result.insertId;
//           sql = `INSERT INTO Prescription_Test (ID, Test, Important) VALUES ('${req.body.prescriptionId}', '${insertId}', '${req.body.important}');`;
//           console.log({ insert_test: sql });
//           connection.query(sql, function (err, result) {
//             if (err) {
//               res.json({ status: "error", reason: "prescription" });
//             } else {
//               res.json({ status: "ok", TestId: insertId });
//             }
//           });
//         }
//       });
//     }
//   });
// });

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
      // console.log("getTreatment");
      //sql query
      let sql = `select Appointment.ID AS appID,
                        Treatment.ID AS treatmentID,
                        Treatment.Name AS treatmentName,
                        Treatment.Dosage AS Dosage,
                        Treatment.Date AS Date
                from Treatment, Prescription_Treatment,Appointment
                where Appointment.Patient = '${req.body.patientId}' and Appointment.Prescription = Prescription_Treatment.ID and Prescription_Treatment.Treatment = Treatment.ID;`;
      // console.log({ sql });

      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "getTreatment" });
        } else {
          console.log({ result });
          // console.log({ result });
          //PROBLEM
          res.json({ status: "ok", result });
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
      let sql = `select Appointment.ID AS appID, Test.ID AS ID , Test.Name AS Name,  Test.Date AS Date, Test.Result AS Result, Test.Report AS Report, Test.Image AS Image from Test, Prescription_Test, Appointment where Appointment.Patient = "${req.body.patientId}" and Appointment.Prescription = Prescription_Test.ID and Prescription_Test.Test = Test.ID;`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "getTest" });
        } else {
          console.log({ result });
          // let insertId = result.insertId;

          res.json({ status: "ok", result });
        }
      });
    }
  });
});

app.post("/appointment/updateSchedule", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "frontdesk") {
      console.log({ body: req.body });
      //sql query
      let sql = `UPDATE Appointment SET Date='${req.body.date}', Priority=${req.body.priority} WHERE ID = ${req.body.appID};`;
      console.log({ sql });
      connection.query(sql, function (err, result) {
        if (err) {
          res.json({ status: "error", reason: "getTest" });
        } else {
          console.log({ result });

          res.json({ status: "ok", result });
        }
      });
    }
  });
});

app.post("/test/schedule", (req, res) => {
  isAuth(connection, req, res, (user) => {
      if (user.Type == "frontdesk") {
          console.log({ body: req.body });

          let sql = `UPDATE Test SET Date='${req.body.date}' WHERE ID = ${req.body.testID};`;
          console.log({ sql });
          connection.query(sql, function (err, result) {
              if (err) {
                  res.json({ status: "error", reason: "getTest" });
              } else {
                  console.log({ result });

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
