const Order = require('../model/Order');
const User = require('../../users/model/User');
const { isAlpha, isInt } = require('validator');
const { errorHandler } = require('../../users/utils/errorHandler');

const createOrder = async (req, res) => {
    try {
        const { orderName, orderAmount, orderItems } = req.body;

        let errObj = {}
        if(!isAlpha(orderName)){
            errObj.orderName = "Alphabet only"
        }
        if(!isInt(orderAmount)){
            errObj.orderAmount = "Numbers only!"
        }
        if(Object.keys(errObj).length > 0){
            return res.status(500).json({ message: "Error", error: errObj });
        }

        const decodedData = res.locals.decodedToken;
        console.log(decodedData)

        const foundUser = await User.findOne({ email: decodedData.email });
        if(!foundUser) throw { message: 'User not found' };
        console.log(foundUser)

        const newOrder = new Order({
            orderName: orderName,
            orderAmount: orderAmount,
            orderItems: orderItems,
            orderOwner: foundUser._id
        })

        const savedOrder = await newOrder.save();

        foundUser.orderHistory.push(savedOrder.id);

        await foundUser.save();

        console.log(newOrder)
        res.status(200).json({  message: "saved new order", payload: savedOrder });
    } catch (error) {
        res.status(500).json(errorHandler(error))
    }
}

const getOrders = async (req, res) => {
    try {
        const decodedData = res.locals.decodedToken;
        const foundUser = await User.findOne({ email: decodedData.email })
        if(!foundUser) throw { message: 'User not found' };
        const foundOrders = await Order.find({ orderOwner: foundUser.id })
        res.status(200).json({ payload: foundOrders });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const decodedData = res.locals.decodedToken;
        const foundUser = await User.findOne({ email: decodedData.email })
        if(!foundUser) throw { message: 'User not found' };

        const filteredArray = foundUser.orderHistory.filter((element) => element.toString() !== id);
        foundUser.orderHistory = filteredArray;
        await foundUser.save();

        res.status(200).json({ message: 'Order was deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

module.exports = {
    createOrder,
    getOrders,
    deleteOrder,
}