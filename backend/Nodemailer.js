import nodemailer from "nodemailer";

function mailDoc(props) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rudrakpatratest@gmail.com",
      pass: "pfvlqifqghhxhoef",
    },
  });

  let testResult = "";
  props.test.forEach((test) => {
    testResult += `<p>Name: <b>${test.name}</b>, Date: <b>${test.date}</b>, Result: <b>${test.result}</b></p>\n`;
  });

  let mailDetails = {
    from: "rudrakpatratest@gmail.com",
    to: props.email,
    subject: "Paitient health report",
    text: "",
    html: `
    <p>Dear Dr. <b>${props.name}</b>,</p>
    <p>The report for the patient named <b>${props.pName}</b> with ID <b>'${props.patient}'</b> for the important tests are as follows </p>
    ${testResult}
    <p>Regards</p>
    <p><b>PARAS</b> Hospital</p>`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err, data);
      console.log({ mailDetails });
    } else {
      console.log({ props });
      console.log("Email sent successfully");
    }
  });
}

export default mailDoc;
