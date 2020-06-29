const mongoose = require('mongoose');

const zoneSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name :{type:String, required: true},
    postalCode:{type:String, required:true},
    minimum:{type: Number, required:true}
})

module.exports = mongoose.model('zone', zoneSchema)