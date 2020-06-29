const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{type:String, required: true},
    category:{type:String, required: true},
    price:{type: Number, required: true},
    availability: {type:Boolean, required:true},
    numberPieces:{type:Number, required:true},
    comment:{type:String, required:true}
})

module.exports = mongoose.model('Product', productSchema)