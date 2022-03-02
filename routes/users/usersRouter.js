var express = require('express');
var router = express.Router();
const { createUser, userLogin, updateProfile, getCurrentUser } = require('./controller/userController');
const {
  checkIsEmpty,
  jwtMiddleware,
  checkIsValid,
  validateLogin,
  validateUpdateData
} = require('./lib/authMiddleware/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/get-current-user', jwtMiddleware, getCurrentUser);
router.post('/create-user', checkIsEmpty, checkIsValid, createUser);
router.post('/login', checkIsEmpty, validateLogin ,userLogin);
router.put('/update-profile', jwtMiddleware, checkIsEmpty, validateUpdateData, updateProfile);

module.exports = router;