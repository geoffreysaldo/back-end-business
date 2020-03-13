const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring')
const User = require('../models/user');
const transporter = require('../mailer/mailer')


exports.user_login_address = (req, res, next) => {
    User.find({email: req.params.address})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    error:"Mail déjà existant"
                })
            }
            else {
                return res.status(200).json({
                    message:"Mail valide"
                })
            }
        })
    }





exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email.toLowerCase()})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    error:" Mail already exists"
                })
            }
            else {
                console.log("salut")
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    } 
                    else {
                        
                        const secretToken = randomstring.generate();
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email.toLowerCase(),
                            password: hash,
                            secretToken: secretToken,
                            firstname: req.body.firstname,
                            lastname:req.body.lastname,
                            confirmed: false
                    })
                    user
                    .save()
                    .then(result => {
                        let mailOptions = {
                            from: 'luchiwalaseyne@gmail.com',
                            to: req.body.email.toLowerCase(),
                            subject: 'Confirmation de compte Luchiwa sushi',
                            text: 'Votre code est confirmation est :' + secretToken
                        };
                        transporter.sendMail(mailOptions, function(err, data){
                            if(err){
                                res.status(500).json({
                                    error : "Un problème est survenue, veuillez recommencer"
                                })                  
                            }
                            else {
                                res.status(201).json({
                                    message: "Votre compte a été créer avec succès, il ne vous reste plus qu'à le valider",
                                    user : result
                                })                            
                            }
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            })
            }
        })
}

exports.user_verify = (req, res, next) => {
    console.log(req.body.secretToken)
    User.find({email: req.body.email.toLowerCase(), secretToken: req.body.secretToken})
        .exec()
        .then(user => {
            if(user == null){
                return res.status(401).json({
                    message: 'Aucun utiliseur trouvé'
                })
            }
            else {
                user.confirmed = true;
                user.secretToken = '';
                User
                    .update({_id: user[0]._id}, {
                        confirmed: true,
                        secretToken: ''
                    }, function(err, data){
                        if(data){
                            return res.status(200).json({
                                user: data,
                                message:"Votre compte a été créé avec succès, vous pouvez maitenant vous connecter"
                            })
                        }
                        if(err){
                            return res.status(401).json({
                                message:"Echec de validation"
                            }) 
                        }
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.user_login = (req, res, next) => {
    User.findOne({email: req.body.email.toLowerCase()})
        .exec()
        .then(user => {
            if(user == null){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, result) =>{
                    if(err){
                        return res.status(401).json({
                            message:"Auth failed"
                        })
                    }
                    if(!user.confirmed){
                        return res.status(401).json({
                            message: 'Votre compte doit être validé'
                        })
                    }
                    if(user.confirmed){
                        const token = jwt.sign({
                            email: user.email.toLowerCase(),
                            userId: user._id
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn:"1h"
                        })
                        return res.status(200).json({
                            message:"Auth successful",
                            firstname : user.firstname,
                            lastname : user.lastname,
                            token: token
                        })
                    }
                    res.status(401).json({
                        message: "Auth failed"
                    })
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.user_delete = (req, res, next) => {
    User.deleteOne({_id : req.params.userId})
        .exec()
        .then(result =>{
            res.status(200).json({
                message: 'User deleted',
                result : result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.user_names = (req, res, next) => {
    User.findOne({_id:req.userData.userId})
        .exec()
        .then(
            user => res.status(200).json({
                firstname:user.firstname,
                lastname:user.lastname
        }))
        .catch(
            err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            }
        )
}

exports.users = (req, res, next) => {
    User.find()
        .exec()
        .then(
            usersList => {
                if(usersList.length > 0) {
                    res.status(200).json({
                        usersList : usersList
                    })
                }
                else {
                    res.status(404).json({
                        message: "Aucun utilisateur"
                    })
                }
            }
        )
        .catch(
            err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            }
        )
}
