const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required: true},
    price: {type: Number, required: true}
});

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: {type:[productSchema], required: true},
    price: {type: Number, required: true}
})

module.exports = mongoose.model('Order', orderSchema);
