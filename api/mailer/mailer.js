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
        clientId: '273627788980-vps759gf37ikhhd35pkqbo8iv956rut0.apps.googleusercontent.com',
        clientSecret: '0Wgl6xCMVMUWHVugQ9b-9baK',
        refreshToken: '1//04LABwak7uyNUCgYIARAAGAQSNwF-L9Ir9BA3WyVS1yqR7VJL20dU-yaj4K4zibHM1hYzsHzgnDQ7MuziQmCVH0KuCVhmzmlsRdI',
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