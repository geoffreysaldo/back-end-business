const nodemailer = require('nodemailer');

// Step 1

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth:{
        type:'login',
        user: 'geoffsaldo@gmail.com',
        pass: 'nat5ghef9a59aaf4c8'
    }
});

//Step 2

let mailOptions = {
    from: 'geoffsaldo@gmail.com',
    to: 'peetz13@hotmail.fr',
    subject: 'Testing and Testing',
    text: 'Salut ça marche'
};

// Step 3

transporter.sendMail(mailOptions, function(err, data){
    if(err){
        console.log(err)
    }
    else {
        console.log("Email sent")
    }
});