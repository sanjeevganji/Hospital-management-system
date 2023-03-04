import express from "express";
import cors from "cors";
import mysql from "mysql2";
import isAuth from "./auth.js";

var connection = mysql.createConnection({
  host: "10.145.146.52",
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
          console.log(err);
          throw err;
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
    res.json(result);
  });
});

app.post("/users", (req, res) => {
  isAuth(connection, req, res, (user) => {
    if (user.Type == "admin") {
      //sql query
      let sql = `INSERT INTO User (Username, Password, Type) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.type}');`;
      connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ status: "ok" });
      });
    }
  });
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on http://localhost:" + PORT);
});
