const mongoose = require('mongoose');


const weekTimeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
        day:{type:Number, required:true, unique: true},
        lunchTime:{
            start:{type:String},
            stop:{type:String},
            disabled:{type:Boolean, required:true}
        },
        dinnerTime:{
            start:{type:String},
            stop:{type:String},
            disabled:{type:Boolean, required:true}
        },
})

module.exports = mongoose.model('weekTime', weekTimeSchema);