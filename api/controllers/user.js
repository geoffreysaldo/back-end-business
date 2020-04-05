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
        .catch(err => {
            res.status(500).json({
                error: "Un problème est survenue, veuillez recommencer"
            })
        })
    }





exports.user_signup = (req, res, next) => {
    console.log(req.body)
    User.find({email: req.body.email.toLowerCase()})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    error:" Mail already exists"
                })
            }
            else {
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
                            lastname: req.body.lastname,
                            phone: req.body.phone,
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
                                    message: "Votre compte a été créé avec succès. Un email de confirmation vient de vous être envoyé. ",
                                    user : result
                                })                            
                            }
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: "Un problème est survenue, veuillez recommencer"
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
            if(user[0] == null){
                return res.status(401).json({
                    message: 'Echec de validation'
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
                    if(!result){
                        return res.status(401).json({
                            message:"Auth failed"
                        })
                    }
                    else { 
                        if(!user.confirmed){
                            return res.status(409).json({
                                message: 'Votre compte doit être validé'
                            })
                        }
                        if(user.confirmed){
                            const token = jwt.sign({
                                email: user.email.toLowerCase(),
                                password: user.password,
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

exports.user_informations = (req, res, next) => {
    User.findOne({_id:req.userData.userId})
    .exec()
    .then(
        user => res.status(200).json({
            id: user._id,
            prenom: user.firstname,
            nom: user.lastname,
            adresse: user.address || null,
            codePostal: user.postalcode || null,
            ville: user.city || null,
            telephone: user.phone,
            email: user.email
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


exports.user_patch_address = (req, res, next) => {
    bcrypt.compare(req.body.password, req.userData.password, (err, result) =>{
        if(!result){
            return res.status(401).json({
                message:"Mot de passe est incorrect"
            })
        }
        else {
            User.updateOne({_id: req.userData.userId},
                {$set:{address: req.body.adresse, city: req.body.ville, postalcode: req.body.codePostal}},
                function(err,doc){
                    if(err){
                        return res.status(405).json({
                            message:"Requête non effectuée"
                        })
                    }
                    else {
                        return res.status(200).json({
                            adress : req.body.adresse,
                            city: req.body.ville, 
                            postalCode: req.body.codePostal,
                            message:"La modification a été effectuée avec succès !"
                        })
                    }
                })
        }
    }) 
}

exports.user_patch_contact = (req, res, next) => {
    console.log(req.userData)
    bcrypt.compare(req.body.password, req.userData.password, (err, result) =>{
        if(!result){
            return res.status(401).json({
                message:"Mot de passe incorrect"
            })
        }
        else{
            if(req.body.update.phone != null && req.body.update.email != null ){
            User.updateOne({_id: req.userData.userId},
                {$set:{phone: req.body.update.phone, email: req.body.update.email}},
                function(err,doc){
                    if(err){
                        return res.status(405).json({
                            message:"Requête non effectuée"
                        })
                    }
                    else {
                        return res.status(200).json({
                            phone : req.body.update.phone,
                            email: req.body.update.email,
                            message:"La modification a été effectuée avec succès !"
                    })
                }
            })
            }
            if(req.body.update.phone != null && req.body.update.email == null ){
                User.updateOne({_id: req.userData.userId},
                    {$set:{phone: req.body.update.phone}},
                    function(err,doc){
                        if(err){
                            return res.status(405).json({
                                message:"Requête non effectuée"
                            })
                        }
                        else {
                            return res.status(200).json({
                                phone : req.body.update.phone,
                                message:"La modification a été effectuée avec succès !"
                        })
                    }
                })
            }
            if(req.body.update.phone == null && req.body.update.email != null ){
                User.updateOne({_id: req.userData.userId},
                    {$set:{email: req.body.update.email}},
                    function(err,doc){
                        if(err){
                            return res.status(405).json({
                                message:"Requête non effectuée"
                            })
                        }
                        else {
                            return res.status(200).json({
                                email: req.body.update.email,
                                message:"La modification a été effectuée avec succès !"
                        })
                    }
                })
            }
        }
    })
}