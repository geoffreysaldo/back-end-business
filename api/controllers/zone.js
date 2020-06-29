const mongoose = require('mongoose');
const Zone = require('../models/zone');

exports.get_zones = (req, res, next)  => {
    Zone.find()
        .sort({minimum:1})
        .exec()
        .then(zones => {
            if(zones.length > 0){
                res.status(200).json(zones)
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    }

exports.post_zone = (req, res, next) => {
    console.log(req.body.name, req.body.postalCode, req.body.minimum)
    const zone = new Zone({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        postalCode: req.body.postalCode,
        minimum: req.body.minimum
    })
    zone.save()
        .then(result => {
            console.log(result)
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// update minimum
exports.update_zone = (req, res, next) => {
    Zone.update({_id: req.body.id},
        {minimum: req.body.minimum}, 
        function(err, data){
            if(data){
                res.status(200).json({
                    messsage: "Le montant minimum a été modifié"
                })
            }
            if(err){
                res.status(401).json({
                    message: 'Echec de la modification'
                })
            }
        })
}

exports.delete_zone = (req, res, next) => {
    Zone.deleteOne({_id: req.body.id})
        .exec()
        .then(result =>
            res.status(200).json(result))
        .catch(err => 
            res.status(500).json({
                error: err
            }))
}