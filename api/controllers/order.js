const mongoose = require('mongoose')

const Order = require('../models/order')
const io = require('../../socket');


exports.orders_get_all = (req, res, next) => {
    Order.find()
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

exports.orders_get_by_id = (req, res, next) => {
    console.log(req.params.userId)
    Order.aggregate()
    .match({userId:new mongoose.mongo.ObjectId(req.params.userId)})
    .group({_id: "$userId",total: {$sum: "$total"}, nbOrders:{$sum: 1}})
    .exec()
    .then(result =>{
        console.log(result)
        Order.find({userId:req.params.userId}).skip(req.params.interval*10).limit(10)
        .exec()
        .then(ordersList => {
        if(ordersList.length > 0){
            clientOrders = {orders:ordersList, total: result[0].total, nbOrders: result[0].nbOrders, lastname: ordersList[0].lastname, firstname: ordersList[0].firstname}
            return res.status(200).json(clientOrders)
        }
        else {
            return res.status(204).json({
                message: "Aucune commande correspond à cette id"
            })
        }
    })})
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
}

exports.orders_get_by_date = (req, res, next) => {
    Order.find({date:req.params.date})
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

exports.orders_get_by_month = (req, res, next) => {
    Order.find({date:{$regex:req.params.month}}).skip(req.params.interval*10).limit(10)
    .exec()
    .then(docs => {
        if(docs.length >= 0){
            //Order.find({date:{$regex:req.params.month}}).count()
            Order.aggregate()
            .match({date:{$regex:req.params.month}})
            .group({_id:null,totalMonth:{$sum:"$total"},numberCommands:{$sum:1}})
            .exec()
            .then(result => {
                returnObject = {commandes:docs, numberCommands:result[0].numberCommands, totalMonth: result[0].totalMonth}
                console.log(returnObject)
                res.status(200).json(returnObject)})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_get_historique = (req, res, next) => {
    Order.distinct('date',{})
    .exec()
    .then(dates => {
        let monthAndYear = []
        dates.map(date => {
            let splittedDate = date.split(" ")[2]+" "+date.split(" ")[3]
            console.log(splittedDate)
             !monthAndYear.includes(splittedDate) ? monthAndYear.push(splittedDate) : null 
        })
        res.status(200).json(monthAndYear);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_post = (req, res, next) =>{
    let total = req.body.products.reduce((acc,product) => acc + product.quantity * product.price, 0).toFixed(2)
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId || null,
        mode: req.body.mode,
        products: req.body.products,
        total: total,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        postalcode: req.body.postalcode,
        date: req.body.date,
        desiredTime: req.body.time,
        chosenTime:'En attente',
        message: req.body.message,
        state:"En attente",
        switch:false
    })
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "POST request has succeed",
                createdProduct: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
    io.getIO().emit('posts', {action:'create', post:order})
}

exports.orders_delete = (req, res, next) => {
    Order.deleteOne({_id : req.params.orderId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'order deleted',
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

exports.order_patch_chosenTime = (req, res, next) => {
    Order.update({_id : req.body.id},
        {chosenTime:req.body.chosenTime,
        state:req.body.state}
        , function(err, data){
            if(data){
                return res.status(200).json({
                    order: data,
                    message:"L'horaire de commande a été choisie"
                })
            }
            if(err){
                return res.status(401).json({
                    message:"Echec de validation"
                }) 
            }
        })
}

exports.order_patch_state = (req, res, next) => {
    Order.update({_id : req.body.id},
        {state:req.body.state,
        switch:req.body.switch}
        , function(err, data){
            if(data){
                return res.status(200).json({
                    order: data,
                    message:"L'état de commande a été modifé"
                })
            }
            if(err){
                return res.status(401).json({
                    message:"Echec de validation"
                }) 
            }
        })
}