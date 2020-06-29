const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required: true},
    price: {type: Number, required: true}
});

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type:mongoose.Schema.Types.ObjectId, required:false},
    mode: {type:String, required: true},
    products: {type:Object, required: true},
    total: {type: Number, required: true},
    lastname: {type:String, required:true},
    firstname: { type:String, required:true},
    phone: { type: String, required: true},
    address: { type: String, required: false},
    city: { type: String, required: false},
    postalcode: { type:String, required:false},
    date: {type:String, required: true},
    desiredTime: {type:String, required: true},
    chosenTime: {type:String, required:false},
    message:{type:String, required:false},
    state:{type:String, required:false},
    switch:{type:Boolean, required:true}
})

module.exports = mongoose.model('Order', orderSchema);
