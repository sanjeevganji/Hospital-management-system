/**
 * authenticates user using basic auth header and calls next() if user is authenticated successfully
 * @param {*} connection
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns the id of the user if authenticated successfully
 */
function isAuthorized(type, connection, req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res
      .status(401)
      .json({ status: "error", reason: "Authorization header is missing" });
    return;
  }
  const encodedCredentials = authHeader.split(" ")[1];
  const decodedCredentials = Buffer.from(
    encodedCredentials,
    "base64"
  ).toString();
  const [username, password] = decodedCredentials.split(":");

  let query;
  query =
    `select * from User where Username="` +
    username +
    `" and Password="` +
    password +
    `" and Type="` +
    type +
    `"`;
    
    console.log(query);
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    //check if user
    if (results.length == 1) {
      next(results[0].id);
    } else {
      res.status(401).json({ status: "error", reason: "Unauthorized" });
    }
  });
}

function onApp(app, connection, cb) {
  let onGET = (path, cb) => {
    app.get(path, (req, res) => {
      let onQuery = (query, cb) => {
        connection.query(query, function (error, results) {
          if (error) {
            res.json({ status: "error", reason: error });
            return;
          }
          if (cb) res.json({ status: "ok", data: cb(results) });
          else res.json({ status: "ok", data: results });
        });
      };
      let onUserType = (type, cb) => {
        isAuthorized(type, connection, req, res, (id) => {
          cb(id);
        });
      };
      cb(onUserType, onQuery, req.params);
    });
  };
  cb(onGET);
}

export { onApp };
