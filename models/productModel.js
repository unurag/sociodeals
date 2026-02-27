const mongoose = require("mongoose");

const porductSchema = mongoose.Schema({
    username: {
        type: String, 
        required: [true, "Please add username"],
    },
    posts: {
        type: Number, default: 0, 
        required: [true, "Please add posts"],
    },
    followers: {
        type: Number, default: 0, 
        required: [true, "Please add followers"],
    },
    following: {
        type: Number, default: 0, 
        required: [true, "Please add following"],
    },
    price: {
        type: Number, default: 0, 
        required: [true, "Please add price"],
    },
    mainprice: {
        type: Number, default: 0, 
        required: [true, "Please add mainprice"],
    },
    status: {
        type: String, 
        required: [true, "Please add status"],
    },
    bio: {
        type: String, 
        required: [true, "Please add bio"],
    },
    img: {
        type: String, 
        required: [true, "Please add img"],
    },
    tag: {
        type: String, 
        required: [true, "Please add tag"],
    },
    age: {
        type: Number, default: 0, 
        required: [true, "Please add age"],
    },
    onSale: {
        type: Boolean, default: false, 
        required: [true, "Please add age"],
    },
},{
    timestamps: true,
});

module.exports = mongoose.model("Products", porductSchema);