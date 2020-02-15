const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/order')


router.get('/', (req, res, next) =>{
    Order.find()
        .select('_id products price')
        .exec()
        .then(docs => {
            console.log(docs);
            if(docs.length >= 0){
                res.status(200).json(docs);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) =>{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        products: req.body.products,
        price: req.body.price
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
})

module.exports = router;
