const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rudrakpatratest@gmail.com",
    pass: "pfvlqifqghhxhoef",
  },
});

let mailDetails = {
  from: "rudrakpatratest@gmail.com",
  to: "das815221@gmail.com",
  subject: "Paitient health is Critical",
  text: "Dear Dr.Akash Das,The patient has died so there is no need to send the further reports.  XD  Regards DBMS Hospital",
  html: `
  <h1>Dear Dr.Akash Das,</h1>
    <p>The patient has died so there is no need to send the further reports.  XD </p>
    <p>Regards</p>
    <p>DBMS Hospital</p>
  `,
};

mailTransporter.sendMail(mailDetails, function (err, data) {
  if (err) {
    console.log("Error Occurs", err, data);
  } else {
    console.log("Email sent successfully");
  }
});
