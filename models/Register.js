const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
const RegisterSchema = new mongoose.Schema({
    R_id:{
        type: Number
    },
    name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        trim:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    type:{
        type: String,
        required: true,
        default: 'customer'
    },
    city:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    profileImg:{
        type: String,
        required: true
    }
});
RegisterSchema.plugin(AutoIncrement, {id:'reg_seq',inc_field: 'R_id'});
module.exports = mongoose.model("Register",RegisterSchema);