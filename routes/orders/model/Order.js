const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderName: String,
    orderAmount: { type: Number },
    orderItems: Array,
    orderOwner: { type: mongoose.Schema.ObjectId, ref: "user" }
}, {
    timestamps: true,
})

module.exports = mongoose.model("order", orderSchema);