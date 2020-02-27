const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


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
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    } 
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email.toLowerCase(),
                            password: hash,
                            firstname: req.body.firstname,
                            lastname:req.body.lastname
                    })
                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "User created",
                            user : result
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: "erreur"
                        })
                    });
                }
            })
            }
        })
}

exports.user_login = (req, res, next) => {
    console.log(req.body)
    User.findOne({email: req.body.email.toLowerCase()})
        .exec()
        .then(user => {
            if(user == null){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            else {
                console.log(user)
                bcrypt.compare(req.body.password, user.password, (err, result) =>{
                    if(err){
                        return res.status(401).json({
                            message:"Auth failed"
                        })
                    }
                    if(result){
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
