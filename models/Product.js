const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const ProductSchema = new mongoose.Schema({
    id:{
        type: Number
        //required: true,
        //unique: true,
        //autoIncrement: true,
        //primaryKey: true
    },
    name:{
        type: String,
        required: true,
        trim:true
    },
    price:{
        type:Number,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true
    },
    /*userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required:true
    },*/
    itemImg:{
        type: String,
        // required: true
        
    },
    R_id:{
        type: Number
    }

});
ProductSchema.plugin(AutoIncrement, {id:'pro_seq',inc_field: 'id'});

module.exports = mongoose.model("Product",ProductSchema);
