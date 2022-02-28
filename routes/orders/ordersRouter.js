var express = require('express');
var router = express.Router();
const Order = require('./model/Order');
const User = require('../users/model/User');
const { checkIsEmpty, jwtMiddleware } = require('../users/lib/authMiddleware/index');
const { isAlpha, isInt } = require('validator');
const { errorHandler } = require('../users/utils/errorHandler');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create-order', jwtMiddleware, async (req, res) => {
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
})

module.exports = router;