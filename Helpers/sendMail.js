const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "aka20hp@gmail.com",
      pass: "pxpg mffb obvx eppv"
    }
  });

  const mailOptions = {
    from: "aka20hp@gmail.com",
    to: email,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
   console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });
}