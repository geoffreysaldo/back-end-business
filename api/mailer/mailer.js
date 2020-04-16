const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

// Step 1

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'luchiwalaseyne@gmail.com',
        clientId: process.env.CLIENT_ID_GMAIL,
        clientSecret: process.env.CLIENT_SECRET_GMAIL,
        refreshToken: process.env.REFRESH_TOKEN_GMAIL,
}

});

//Step 2



// Step 3
/*
transporter.sendMail(mailOptions, function(err, data){
    if(err){
        console.log(err)
    }
    else {
        console.log("Email sent")
    }
});*/
module.exports = transporter;