// const mysql = require('mysql');
// const fs = require('fs');
import mysql from "mysql2";
import fs from "fs";

var config = {
  host: "dbms-hostpital.mysql.database.azure.com",
  user: "atishay",
  password: "pass@13",
  database: "hospital",
  port: 3306,
  ssl: { ca: fs.readFileSync("./files/BaltimoreCyberTrustRoot.crt.pem") },
};

const conn = new mysql.createConnection(config);

conn.connect(function (err) {
  if (err) {
    console.log("!!! Cannot connect !!! Error:");
    throw err;
  } else {
    console.log("Connection established.");
    queryDatabase();
  }
});

function queryDatabase() {
  conn.query(
    "DROP TABLE IF EXISTS inventory;",
    function (err, results, fields) {
      if (err) throw err;
      console.log("Dropped inventory table if existed.");
    }
  );
  conn.query(
    "CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);",
    function (err, results, fields) {
      if (err) throw err;
      console.log("Created inventory table.");
    }
  );
  conn.query(
    "INSERT INTO inventory (name, quantity) VALUES (?, ?);",
    ["banana", 150],
    function (err, results, fields) {
      if (err) throw err;
      else console.log("Inserted " + results.affectedRows + " row(s).");
    }
  );
  conn.query(
    "INSERT INTO inventory (name, quantity) VALUES (?, ?);",
    ["orange", 154],
    function (err, results, fields) {
      if (err) throw err;
      console.log("Inserted " + results.affectedRows + " row(s).");
    }
  );
  conn.query(
    "INSERT INTO inventory (name, quantity) VALUES (?, ?);",
    ["apple", 100],
    function (err, results, fields) {
      if (err) throw err;
      console.log("Inserted " + results.affectedRows + " row(s).");
    }
  );
  conn.end(function (err) {
    if (err) throw err;
    else console.log("Done.");
  });
}
