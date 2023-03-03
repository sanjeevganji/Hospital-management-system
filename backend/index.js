import express from "express";
import mysql from "mysql2";
import { onApp } from "./auth.js";

var connection = mysql.createConnection({
  host: "10.5.18.71",
  user: "20CS30008",
  password: "DakRR#2020",
  database: "rp",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

var app = express();
var PORT = 3000;

// For parsing application/json
app.use(express.json());

console.log("hello");
onApp(app, connection, (onGET) => {
  onGET("/users", (onUserType, onQuery, params) => {
    onUserType("admin", (id) => {
      onQuery("SELECT * FROM User;");
    });
  });

  onGET("/appointments", (onUserType, onQuery, params) => {
    onUserType("doctor", (id) => {
      onQuery(`SELECT * from Appointments where doctorId=${id}`, (results) => {
        let appointments = [
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
        ];
        return appointments;
      });
    });
  });

  onGET("/patient/:number/treatments", (onUserType, onQuery, params) => {
    onUserType("doctor", (id) => {
      onQuery(`SELECT 1`, (results) => {
        let patientId = params.number;
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
      });
    });
  });

  onGET("/patient/:number/tests", (onUserType, onQuery, params) => {
    onUserType("doctor", (id) => {
      onQuery(`SELECT 1`, (results) => {
        let tests = [
          {
            id: 1,
            name: "Test 1",
          },
          {
            id: 2,
            name: "Test 2",
          },
        ];
        return tests;
      });
    });
  });
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on http://localhost:" + PORT);
});
