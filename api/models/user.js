const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email: {type: String,
            required: true,
            unique: true,
            match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/},
    password: { type: String, required: true},
    admin:{ type:Boolean, defaultValue:false, required:true },
    secretToken: { type: String, required: true},
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    phone: { type: String, required: true},
    confirmed: { type: Boolean, defaultValue: false},
    address: { type: String, required: false},
    city: { type: String, required: false},
    postalcode: { type:String, required:false}
})

module.exports = mongoose.model('User', userSchema)