var express = require('express');
var router = express.Router();
const { jwtMiddleware } = require('../users/lib/authMiddleware/index');
const { createOrder, getOrders, deleteOrder } = require('./controller/orderController');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create-order', jwtMiddleware, createOrder);

// Get all orders from the current user
router.get('/get-orders/', jwtMiddleware, getOrders);

// Delete a order
router.delete('/delete-order/:id', jwtMiddleware, deleteOrder);

module.exports = router;