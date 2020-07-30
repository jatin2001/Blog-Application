require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'jatinkumarjk2001@gmail.com',
    pass: process.env.GM_PASS,
  }
}));



module.exports = function sendEmail(from,to,subject,html){

    var mailOptions = {
        from,
        to,
        subject,     
        html
      };
       
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
   
}
