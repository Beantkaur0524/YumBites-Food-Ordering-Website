const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema({
    id:Number,
    name:String,
    price:Number,
    itemImg:String,
    qnty:{
        type:Number,
        default:1
    }
}) ;
module.exports = mongoose.model("Cart",CartSchema);

