const mongoose = require('mongoose')

const Product = require('../models/product')
const io = require('../../socket');

exports.products_get_all = (req, res, next) =>{
    Product.find()
        .select('_id name price')
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
}

exports.products_by_category = (req, res, next) => {
    Product.find({category:req.params.category})
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
}

exports.product_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price')
        .exec()
        .then(doc => {
            console.log('from database', doc);
            if(doc){
                res.status(200).json(doc)
            } else {
                res.status(404).json({message: 'No valid entry found for provided Id'})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        });
    if (id === 'special'){
        res.status(200).json({
            message:"You discovered the special ID",
            id : id
        })
    }
}

exports.products_post = (req, res, next) =>{
    const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        comment: req.body.comment,
        numberPieces: req.body.numberPieces,
        availability: req.body.availability
    })
    product
        .save()
        .then(result => {
            io.getIO().emit('post_product', {action:'create', post:product})
            res.status(201).json({
                message: "POST request has succeed",
                createdProduct: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.products_patch = (req, res, next) =>{
    const id = req.params.productId;
    const updateOps = {};
    for(let [key, value] of Object.entries(req.body)){
        updateOps[key] = value;
    }
    Product.findOneAndUpdate({_id: id}, {$set: updateOps},{"new":true})
        .exec()
        .then(result => {
            console.log(result)
            io.getIO().emit('update_product', {action:'update', update:result})
            res.status(200).json({
                result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.products_delete = (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}