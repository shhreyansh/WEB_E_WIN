  // import { v4 as uuidv4 } from 'uuid';
  const { v4: uuidv4 } = require("uuid");
  const mongoose = require("mongoose");
  const express = require("express");
  const cors = require("cors");
  const nodemailer = require("nodemailer");

  const app = express();

  app.use(express.json());
  app.use(cors());

  mongoose
    .connect("mongodb://127.0.0.1:27017/WINNEXT", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to db"))
    .catch(console.error);

  const User = require("./api/usertable");
  const Doctor = require("./api/doctortable");

  app.post("/api/newQuery", async (req, res) => {
    const newQuery = new User({
      userId: `USER${uuidv4()}`,
      userQueryDate: new Date(),
      userName: req.body.name,
      userEmail: req.body.mail,
      userPhoneNumber: req.body.num,
      userSpecialization: req.body.special,
      userQuery: req.body.query,
    });
    await newQuery.save();
    res.send("Query saved successfully");
    
    // // // // // // // sending mail
    const doc = await Doctor.findOne({ doctorSpecialization: req.body.special });
    sendmail(doc, req.body.name, req.body.num, req.body.mail, req.body.query);
  });

  app.post("/api/newDoctor", async (req, res) => {
    const newQuery = new Doctor({
      doctorId: `DOC${uuidv4()}`,
      docAdded: new Date(),
      doctorName: req.body.name,
      doctorEmail: req.body.mail,
      doctorPhoneNumber: req.body.phno,
      doctorSpecialization: req.body.spec,
    });

    await newQuery.save();
    res.send("Record saved successfully");
  });

  app.get("/api/allUsers", async (req, res) => {
    const all = await User.find({});
    res.json(all);
  });
  app.get("/api/allDoctors", async (req, res) => {
    const all = await Doctor.find({});
    res.json(all);
  });
  app.get("/api/doctor/:id", async (req, res) => {
    const Id = req.params.id;
    const all = await Doctor.findOne({ doctorId: Id });
    res.json(all);
  });
  app.post("/api/doctorupd/:id", async (req, res) => {
    const Id = req.params.id;
    const find = await Doctor.findOne({ doctorId: Id });

    (find.doctorName = req.body.doctorName),
      (find.doctorEmail = req.body.doctorEmail),
      (find.doctorPhoneNumber = req.body.doctorPhoneNumber),
      (find.doctorSpecialization = req.body.doctorSpecialization);

    await find.save();
  });

  app.delete("/api/deleteDoctor/:docid", async (req, res) => {
    const Id = req.params.docid;
    const deleted = await Doctor.findOneAndDelete({ doctorId: Id });
    if (!deleted) {
      return res.status(404).send("doctor not found");
    }
    res.send("Doctor deleted successfully");
  });

  app.delete("/api/deleteQuery/:id", async (req, res) => {
    const Id = req.params.id;
    const deleted = await User.findOneAndDelete({ userId: Id });
    if (!deleted) {
      return res.status(404).send("query not found");
    }
    res.send("user,query deleted successfully");
  });

  const sendmail = async (doc, name, phno, usermail, query) => {
    
    // Send email to the found doctor
    const transporter = nodemailer.createTransport({
      service: "gmail",
      // secure: false,
      auth: {
        user: "1winnext@gmail.com",
        // pass: 'Yashalwayswin@99'
        pass: "ukqshdzbrqurmrrw",
      },
    });
    const text = `
      Dear ${doc.doctorName},/n
      We have recieved a query from a patient named ${name}, regarding your specialization,
      /n/n The query of the patient is
      ${query} 
      /n/n
      Details of the patient are:
      /n
      Patient Name: ${name},
  /n  Patient Phone Number: ${phno},
  /n  Patient E-mail ID: ${usermail}
      `;
    const docm = doc.doctorEmail;
    console.log(docm)
    const mailOptions = {
      from: "WINNEXT <1winnext@gmail.com>",
      // to: doc.doctorEmail,
      // to: 'gupta.jatin273@gmail.com',
      to: docm,
      subject: "From :WINNEXT",
      text: text,
      // Dear Dr. ${doc.doctorName},
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
        // console.log(nodemailer.getTestMessageUrl(info))
      }
    });
    sendmail2(doc,name,phno,usermail,query)
  };

  const sendmail2 = async (doc, name, phno, usermail, query) => {
    // console.log('mail sent', mail);
    
    // Send email to the found doctor
    const transporter = nodemailer.createTransport({
      service: "gmail",
      // secure: false,
      auth: {
        user: "1winnext@gmail.com",
        // pass: 'Yashalwayswin@99'
        pass: "ukqshdzbrqurmrrw",
      },
    });
    const text = `
    Dear ${name},
    /n We have successfully received your query and the doctor assigned to you is ${doc.doctorName},
    /n Have patience, the doctor will soon contact you.
    /n/n Regards,
    /n WINNEXT Team
      `;
    const docm = usermail;
    const mailOptions = {
      from: "WINNEXT <1winnext@gmail.com>",
      // to: doc.doctorEmail,
      // to: 'gupta.jatin273@gmail.com',
      to: docm,
      subject: "From :WINNEXT",
      text: text,
      // Dear Dr. ${doc.doctorName},
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
        // console.log(nodemailer.getTestMessageUrl(info))
      }
    });
  };

  app.listen(3007, () => console.log("Server started at 3007"));
