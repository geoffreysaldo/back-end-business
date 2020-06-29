const mongoose = require('mongoose')
const Time = require('../models/time')


exports.time_get_all = (req, res, next) => {
    Time.find()
        .sort({day:1})
        .exec()
        .then(docs => {
            if(docs.length >= 0){
                res.status(200).json(docs);
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.time_get_today_tomorrow = (req, res, next) => {
    if(req.params.today < req.params.tomorrow){
    Time.find({day: {$in: [req.params.today,req.params.tomorrow]}})
        .exec()
        .then(docs => {
            if(docs.length >= 0){
                console.log(docs)
                res.status(200).json(docs);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })}
    else{
        Time.find({day: {$in: [req.params.today,req.params.tomorrow]}}).sort({day:-1})
            .exec()
            .then(docs => {
                if(docs.length >= 0){
                    console.log(docs)
                    res.status(200).json(docs);
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
    }
}

exports.time_post = (req, res, next) =>{
    const time = new Time({
        _id:new mongoose.Types.ObjectId(),
        day:req.body.day,
        lunchTime: req.body.lunchTime,
        dinnerTime: req.body.dinnerTime,
        disabled:req.body.disabled
    })
    time
        .save()
        .then(result => {
            res.status(201).json({
                message: "POST request has succeed",
                time: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.time_delete = (req, res,next) => {
    Time.deleteOne({day : req.params.day})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'day time deleted',
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


exports.time_update = (req, res, next) => {
    if(req.body.lunchOrDinner === "lunchTime") {
    Time.update({day : req.body.day},
        {lunchTime:{start:req.body.start,stop:req.body.stop,disabled:req.body.disabled}}
        , function(err, data){
            if(data){
                return res.status(200).json({
                    time: data,
                    message:"L'horaire d'ouverture a été modifiée"
                })
            }
            if(err){
                return res.status(401).json({
                    message:"Echec de validation"
                }) 
            }
        })
    }
    else {
        Time.update({day : req.body.day},
            {dinnerTime:{start:req.body.start,stop:req.body.stop,disabled:req.body.disabled}}
            , function(err, data){
                if(data){
                    return res.status(200).json({
                        time: data,
                        message:"L'horaire d'ouverture a été modifiée"
                    })
                }
                if(err){
                    return res.status(401).json({
                        message:"Echec de validation"
                    }) 
                }
            })
    }
}

exports.time_update_disable = (req, res, next) => {
    console.log(req.body._id,req.body.lunchOrDinner,req.body.value)
    if(req.body.lunchOrDinner === "lunchTime") {
    Time.update({_id : req.body._id},
        {lunchTime:{disabled:req.body.value, start:req.body.start, stop:req.body.stop}}
        , function(err, data){
            if(data){
                return res.status(200).json({
                    time: data,
                    message:"L'horaire d'ouverture a été modifiée"
                })
            }
            if(err){
                return res.status(401).json({
                    message:"Echec de validation"
                }) 
            }
        })
    }
    else {
        Time.update({_id : req.body._id},
            {dinnerTime:{disabled:req.body.value, start:req.body.start, stop:req.body.stop}}
            , function(err, data){
                if(data){
                    return res.status(200).json({
                        time: data,
                        message:"L'horaire d'ouverture a été modifiée"
                    })
                }
                if(err){
                    return res.status(401).json({
                        message:"Echec de validation"
                    }) 
                }
            })
    }
}